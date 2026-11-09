import {inject, Injectable} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {Firestore, collection, doc, getDoc, getDocs} from '@angular/fire/firestore';
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
 * Data is read once and shared as signals; it is read-only for the public pages.
 * Storage: `bibliotheque/{libraryId}` holds the library infos, authors and publishers, and one document per
 * category sits in its `categories` subcollection (see docs/firestore-model.md).
 */
@Injectable({providedIn: 'root'})
export class LibraryRepository {
  private readonly firestore = inject(Firestore);

  /** All libraries in display order; `undefined` while loading. */
  readonly libraries = toSignal(
    forkJoin(LIBRARY_ORDER.map(libraryId => this.loadLibrary(libraryId))).pipe(
      catchError(error => {
        console.error('Unable to load the libraries', error);
        return of([] as Array<Biblio>);
      })
    )
  );

  /** An unknown id resolves to the first library, as the app always did. */
  libraryById(libraryId?: string): Biblio | undefined {
    const index = LIBRARY_ORDER.indexOf(libraryId as Libraries);
    return this.libraries()?.[Math.max(index, 0)];
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
