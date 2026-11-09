import {Author, Biblio, Book, Category, Publisher, Series} from '../../models/author.model';

/**
 * Pure, immutable edit operations on a library tree. They return a new tree and never touch their input,
 * so they can be applied to signals and, later, translated to whatever the backend needs.
 */

/** Where a series lives: directly in a category, or under one of its authors. */
export interface SeriesLocation {
  categoryId: string;
  authorId?: string;
}

/** Where a book lives: in a series, or directly under an author. */
export interface BookLocation extends SeriesLocation {
  seriesId?: string;
}

function upsert<T extends {id?: string}>(items: ReadonlyArray<T> | undefined, item: T): Array<T> {
  const list = items ?? [];
  return list.some(existing => existing.id === item.id)
    ? list.map(existing => (existing.id === item.id ? item : existing))
    : [...list, item];
}

function without<T extends {id?: string}>(items: ReadonlyArray<T> | undefined, id?: string): Array<T> {
  return (items ?? []).filter(item => item.id !== id);
}

function mapById<T extends {id?: string}>(items: ReadonlyArray<T> | undefined, id: string | undefined, update: (item: T) => T) {
  return (items ?? []).map(item => (item.id === id ? update(item) : item));
}

function withCategories(biblio: Biblio, update: (categories: Array<Category>) => Array<Category>): Biblio {
  return {...biblio, library: {...biblio.library, categories: update(biblio.library?.categories ?? [])}};
}

function withCategory(biblio: Biblio, categoryId: string, update: (category: Category) => Category): Biblio {
  return withCategories(biblio, categories => mapById(categories, categoryId, update));
}

export function saveCategory(biblio: Biblio, category: Category): Biblio {
  return withCategories(biblio, categories => upsert(categories, category));
}

export function removeCategory(biblio: Biblio, categoryId?: string): Biblio {
  return withCategories(biblio, categories => without(categories, categoryId));
}

/** Authors of the whole library (series libraries) when no category is given, otherwise of that category. */
export function saveAuthor(biblio: Biblio, author: Author, categoryId?: string): Biblio {
  return categoryId
    ? withCategory(biblio, categoryId, category => ({...category, authors: upsert(category.authors, author)}))
    : {...biblio, authors: upsert(biblio.authors, author)};
}

export function removeAuthor(biblio: Biblio, authorId?: string, categoryId?: string): Biblio {
  return categoryId
    ? withCategory(biblio, categoryId, category => ({...category, authors: without(category.authors, authorId)}))
    : {...biblio, authors: without(biblio.authors, authorId)};
}

export function savePublisher(biblio: Biblio, publisher: Publisher): Biblio {
  return {...biblio, publishers: upsert(biblio.publishers, publisher)};
}

export function removePublisher(biblio: Biblio, publisherId?: string): Biblio {
  return {...biblio, publishers: without(biblio.publishers, publisherId)};
}

function updateSeriesList(
  biblio: Biblio,
  location: SeriesLocation,
  update: (series: Array<Series>) => Array<Series>
): Biblio {
  return withCategory(biblio, location.categoryId, category =>
    location.authorId
      ? {
          ...category,
          authors: mapById(category.authors, location.authorId, author => ({
            ...author,
            series: update(author.series ?? []),
          })),
        }
      : {...category, series: update(category.series ?? [])}
  );
}

export function saveSeries(biblio: Biblio, location: SeriesLocation, series: Series): Biblio {
  return updateSeriesList(biblio, location, list => upsert(list, series));
}

export function removeSeries(biblio: Biblio, location: SeriesLocation, seriesId?: string): Biblio {
  return updateSeriesList(biblio, location, list => without(list, seriesId));
}

function updateBooks(biblio: Biblio, location: BookLocation, update: (books: Array<Book>) => Array<Book>): Biblio {
  if (location.seriesId) {
    return updateSeriesList(biblio, location, list =>
      mapById(list, location.seriesId, series => ({...series, books: update(series.books ?? [])}))
    );
  }
  return withCategory(biblio, location.categoryId, category => ({
    ...category,
    authors: mapById(category.authors, location.authorId, author => ({...author, books: update(author.books ?? [])})),
  }));
}

export function saveBook(biblio: Biblio, location: BookLocation, book: Book): Biblio {
  return updateBooks(biblio, location, books => upsert(books, book));
}

export function removeBook(biblio: Biblio, location: BookLocation, bookId?: string): Biblio {
  return updateBooks(biblio, location, books => without(books, bookId));
}
