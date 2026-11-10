import {inject, Injectable, signal} from '@angular/core';
import {Firestore, collection, doc, getDoc, getDocs, writeBatch} from '@angular/fire/firestore';
import {catchError, forkJoin, from, map, Observable, of} from 'rxjs';
import {Biblio, Category, Libraries, Library} from '../../models/author.model';

// Display order of the libraries (the order they had in the legacy `bibliotheque` array).
const LIBRARY_ORDER: ReadonlyArray<Libraries> = [
  Libraries.IMAGINAIRE,
  Libraries.INCLASSABLE,
  Libraries.LIBRAIRIE_JEUNESSE,
  Libraries.LITTERATURE_ADULTE,
];

/**
 * Single access point to the library catalogue (library > categories > series > books, authors, publishers).
 * Everything backend specific lives in this class so the storage can be swapped without touching the views.
 * Data is read once and shared as a signal; only the settings page saves it back, through `save`.
 * Storage: `bibliotheque/{libraryId}` holds the library infos, authors and publishers, and one document per
 * category sits in its `categories` subcollection (see docs/firestore-model.md).
 */
@Injectable({providedIn: 'root'})
export class LibraryRepository {
  private readonly firestore = inject(Firestore);

  private readonly loadedLibraries = signal<Array<Biblio> | undefined>(undefined);

  /** All libraries in display order; `undefined` while loading. */
  readonly libraries = this.loadedLibraries.asReadonly();

  constructor() {
    forkJoin(LIBRARY_ORDER.map(libraryId => this.loadLibrary(libraryId))).pipe(
      catchError(error => {
        console.error('Unable to load the libraries', error);
        return of([] as Array<Biblio>);
      })
    ).subscribe(libraries => this.loadedLibraries.set(libraries));
  }

  /** An unknown id resolves to the first library, as the app always did. */
  libraryById(libraryId?: string): Biblio | undefined {
    const index = LIBRARY_ORDER.indexOf(libraryId as Libraries);
    return this.libraries()?.[Math.max(index, 0)];
  }

  /**
   * Writes a whole library back: the library document (infos, authors, publishers, category order) and one
   * document per category, in a single batch. Categories that disappeared from the edited copy are deleted.
   */
  async save(libraryId: string, biblio: Biblio): Promise<void> {
    const index = LIBRARY_ORDER.indexOf(libraryId as Libraries);
    const previous = this.loadedLibraries()?.[index];
    if (index < 0 || !previous) {
      throw new Error(`Unknown library ${libraryId}`);
    }
    const {categories, ...libraryInfo} = biblio.library;
    const batch = writeBatch(this.firestore);
    batch.set(doc(this.firestore, 'bibliotheque', libraryId), withoutUndefined({
      library: {...libraryInfo, categoryIds: categories.map(category => category.id)},
      authors: biblio.authors,
      publishers: biblio.publishers,
    }));
    for (const category of categories) {
      batch.set(doc(this.firestore, 'bibliotheque', libraryId, 'categories', category.id ?? ''), withoutUndefined(category));
    }
    const kept = new Set(categories.map(category => category.id));
    for (const removed of previous.library.categories.filter(category => !kept.has(category.id))) {
      batch.delete(doc(this.firestore, 'bibliotheque', libraryId, 'categories', removed.id ?? ''));
    }
    await batch.commit();
    this.loadedLibraries.update(libraries => libraries?.map((library, position) => position === index ? structuredClone(biblio) : library));
  }

  private loadLibrary(libraryId: Libraries): Observable<Biblio> {
    return from(Promise.all([
      getDoc(doc(this.firestore, 'bibliotheque', libraryId)),
      getDocs(collection(this.firestore, 'bibliotheque', libraryId, 'categories')),
    ])).pipe(
      map(([librarySnapshot, categorySnapshots]) => {
        const stored = librarySnapshot.data() as StoredLibrary | undefined;
        const categoriesById = new Map(categorySnapshots.docs.map(snapshot => [snapshot.id, snapshot.data() as Category]));
        const {categoryIds = [], ...libraryInfo} = stored?.library ?? {};
        const categories = categoryIds.map(categoryId => categoriesById.get(categoryId)).filter((category): category is Category => !!category);
        return {
          library: {...libraryInfo, categories} as Library,
          authors: stored?.authors ?? [],
          publishers: stored?.publishers ?? [],
        } as Biblio;
      })
    );
  }
}

interface StoredLibrary {
  library?: Omit<Library, 'categories'> & {categoryIds?: string[]};
  authors?: Biblio['authors'];
  publishers?: Biblio['publishers'];
}

/** Firestore rejects `undefined` values, which the editing helpers may leave in optional fields. */
function withoutUndefined<Value>(value: Value): Value {
  return JSON.parse(JSON.stringify(value)) as Value;
}
