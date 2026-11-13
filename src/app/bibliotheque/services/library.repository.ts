import {inject, Injectable, signal} from '@angular/core';
import {Firestore, collection, doc, getDoc, getDocs, runTransaction, writeBatch} from '@angular/fire/firestore';
import {catchError, forkJoin, from, map, Observable, of} from 'rxjs';
import {v4 as uuidv4} from 'uuid';
import {Author, Biblio, Book, BookStatus, Category, Libraries, Library, ViewBy} from '../../models/author.model';
import {BookLocator, findAuthorId, findBook, insertBook, removeBooks, replaceBook, setBooksStatus, splitPersonName} from '../models/library-books';

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

  /**
   * Adds or edits one book, writing only the category documents it concerns (and the authors index of the library
   * when the author is new), in one transaction. Changing the category moves the book; changing its author, in a
   * by-author category, moves it under the other author. Never rewrites the whole library.
   */
  async saveBook(libraryId: string, input: BookSave): Promise<void> {
    const sourceId = input.original?.categoryId;
    const ids = [...new Set([input.categoryId, ...(sourceId ? [sourceId] : [])])];
    await this.changeCategories(libraryId, ids, (categories, authors) => {
      const target = categories.get(input.categoryId) as Category;
      const sourceCategory = sourceId ? categories.get(sourceId) as Category : undefined;
      const previous = input.original && sourceCategory ? findBook(sourceCategory, input.original) : undefined;
      const name = input.authorName.trim();
      let authorId = name ? findAuthorId(authors, name) : previous?.authorIds[0];
      if (!authorId) {
        authorId = uuidv4();
        authors.push({id: authorId, ...splitPersonName(name)});
      }
      const author = authors.find(candidate => candidate.id === authorId) as Author;
      const book: Book = {
        ...input.book,
        id: input.book.id ?? uuidv4(),
        ...(target.by === ViewBy.BY_AUTHOR ? {by: ViewBy.BY_AUTHOR} : {}),
      };
      const container = input.original && sourceCategory ? this.containerName(sourceCategory, input.original) : undefined;
      const inPlace = !!previous && sourceId === input.categoryId
        && (target.by === ViewBy.BY_AUTHOR ? previous.authorIds[0] === authorId : !input.seriesName || container === input.seriesName);
      if (inPlace && input.original) {
        categories.set(input.categoryId, replaceBook(target, input.original, {...book, authorIds: previous.authorIds}));
        return;
      }
      if (input.original && sourceId) {
        categories.set(sourceId, removeBooks(categories.get(sourceId) as Category, [input.original]));
      }
      categories.set(input.categoryId, insertBook(categories.get(input.categoryId) as Category, book,
        {authorId, firstName: author.firstName, lastName: author.lastName, seriesName: input.seriesName || 'Divers'}, uuidv4));
    });
  }

  /** Removes books, one transaction for all the categories involved. */
  removeBooks(libraryId: string, locators: ReadonlyArray<BookLocator>): Promise<void> {
    return this.changeCategories(libraryId, this.categoryIdsOf(locators), categories => {
      for (const id of categories.keys()) {
        categories.set(id, removeBooks(categories.get(id) as Category, locators.filter(locator => locator.categoryId === id)));
      }
    });
  }

  /** Sets the status of books, one transaction for all the categories involved. */
  setBooksStatus(libraryId: string, locators: ReadonlyArray<BookLocator>, status: BookStatus): Promise<void> {
    return this.changeCategories(libraryId, this.categoryIdsOf(locators), categories => {
      for (const id of categories.keys()) {
        categories.set(id, setBooksStatus(categories.get(id) as Category, locators.filter(locator => locator.categoryId === id), status));
      }
    });
  }

  private categoryIdsOf(locators: ReadonlyArray<BookLocator>): string[] {
    return [...new Set(locators.map(locator => locator.categoryId))];
  }

  private containerName(category: Category, locator: BookLocator): string | undefined {
    return (category.series ?? []).find(series => series.id === locator.containerId)?.name;
  }

  /**
   * Reads the given category documents (and the authors index), lets `change` modify them, writes them back, all in one
   * transaction so a concurrent edit is never overwritten, then mirrors the result in the local copy.
   */
  private async changeCategories(
    libraryId: string, categoryIds: ReadonlyArray<string>,
    change: (categories: Map<string, Category>, authors: Author[]) => void,
  ): Promise<void> {
    const libraryReference = doc(this.firestore, 'bibliotheque', libraryId);
    const result = await runTransaction(this.firestore, async transaction => {
      const categoryReferences = categoryIds.map(id => doc(this.firestore, 'bibliotheque', libraryId, 'categories', id));
      const snapshots = await Promise.all(categoryReferences.map(reference => transaction.get(reference)));
      const librarySnapshot = await transaction.get(libraryReference);
      const categories = new Map(snapshots.map((snapshot, index) => [categoryIds[index], snapshot.data() as Category]));
      const authors = [...((librarySnapshot.data() as StoredLibrary | undefined)?.authors ?? [])];
      const authorCount = authors.length;
      change(categories, authors);
      categoryReferences.forEach((reference, index) => transaction.set(reference, withoutUndefined(categories.get(categoryIds[index]))));
      if (authors.length !== authorCount) {
        transaction.update(libraryReference, {authors: withoutUndefined(authors)});
      }
      return {categories, authors};
    });
    this.loadedLibraries.update(libraries => libraries?.map(biblio => biblio.library.id !== libraryId ? biblio : {
      ...biblio,
      authors: result.authors,
      library: {...biblio.library, categories: (biblio.library.categories ?? []).map(category => result.categories.get(category.id ?? '') ?? category)},
    }));
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

/** What the administration hands over to add or edit a book. The book carries the fields the form edits. */
export interface BookSave {
  original?: BookLocator;
  book: Book;
  categoryId: string;
  /** "Prénom Nom"; empty keeps the author of the book being edited. */
  authorName: string;
  /** Series libraries only; empty means the "Divers" series, or the series the book already is in. */
  seriesName: string;
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
