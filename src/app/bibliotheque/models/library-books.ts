import {Author, Biblio, Book, BookStatus, Category, Series, SeriesStatus, ViewBy} from '../../models/author.model';

/**
 * Where a book sits inside its category. Most books have an `id`; the ones that do not are found by the container
 * holding them and their position in it. The cote (`ref`) is never an identifier: many books share one.
 */
export interface BookLocator {
  categoryId: string;
  id?: string;
  containerId?: string;
  position: number;
}

export interface BookEntry {
  book: Book;
  category: Category;
  author?: Author;
  series?: Series;
  locator: BookLocator;
}

type Container = Author | Series;

/** Every container (series or author) of a category, with the series that hang under authors. */
function containers(category: Category): ReadonlyArray<Container> {
  return [
    ...(category.series ?? []),
    ...(category.authors ?? []).flatMap(author => [author, ...(author.series ?? [])]),
  ];
}

/** Every book of the library except the separators, with where to find it again. */
export function flattenBooks(biblio: Biblio): BookEntry[] {
  return (biblio.library?.categories ?? []).flatMap(category =>
    containers(category).flatMap(container =>
      (container.books ?? []).flatMap((book, position) => book.status === BookStatus.SEPARATOR ? [] : [{
        book,
        category,
        author: (category.authors ?? []).find(author => author === container),
        series: (container as Series).status !== undefined || (category.series ?? []).includes(container as Series) ? container as Series : undefined,
        locator: {categoryId: category.id ?? '', id: book.id, containerId: container.id, position},
      }])));
}

/** Stable key of an entry: the book id, or a position-based fallback for the books that have none. */
export function bookKey(locator: BookLocator): string {
  return locator.id ?? `${locator.categoryId}/${locator.containerId ?? ''}/${locator.position}`;
}

function matches(book: Book, container: Container, position: number, locator: BookLocator): boolean {
  return locator.id ? book.id === locator.id : !book.id && container.id === locator.containerId && position === locator.position;
}

function mapBooks(category: Category, change: (books: ReadonlyArray<Book>, container: Container) => Book[]): Category {
  const series = (list?: ReadonlyArray<Series>) => list?.map(item => ({...item, books: change(item.books ?? [], item)}));
  return {
    ...category,
    ...(category.series ? {series: series(category.series)} : {}),
    ...(category.authors ? {
      authors: category.authors.map(author => ({
        ...author,
        ...(author.books ? {books: change(author.books, author)} : {}),
        ...(author.series ? {series: series(author.series)} : {}),
      })),
    } : {}),
  };
}

/** Whether the category holds a book at this locator. */
export function hasBook(category: Category, locator: BookLocator): boolean {
  return containers(category).some(container => (container.books ?? []).some((book, position) => matches(book, container, position, locator)));
}

/** The book at this locator, with the entry holding it. */
export function findBook(category: Category, locator: BookLocator): Book | undefined {
  for (const container of containers(category)) {
    const found = (container.books ?? []).find((book, position) => matches(book, container, position, locator));
    if (found) {
      return found;
    }
  }
  return undefined;
}

/** The category without those books; an author left with no book at all goes away too, as the editor has always done. */
export function removeBooks(category: Category, locators: ReadonlyArray<BookLocator>): Category {
  const removed = mapBooks(category, (books, container) =>
    books.filter((book, position) => !locators.some(locator => matches(book, container, position, locator))));
  return removed.authors
    ? {...removed, authors: removed.authors.filter(author => (author.books?.length ?? 0) > 0 || (author.series ?? []).some(series => (series.books?.length ?? 0) > 0))}
    : removed;
}

export function setBooksStatus(category: Category, locators: ReadonlyArray<BookLocator>, status: BookStatus): Category {
  return mapBooks(category, (books, container) =>
    books.map((book, position) => locators.some(locator => matches(book, container, position, locator)) ? {...book, status} : book));
}

export function replaceBook(category: Category, locator: BookLocator, replacement: Book): Category {
  return mapBooks(category, (books, container) =>
    books.map((book, position) => matches(book, container, position, locator) ? replacement : book));
}

export interface BookTarget {
  authorId: string;
  /** Only used when the author is new to the category. */
  firstName: string;
  lastName: string;
  /** Series libraries: the series the book goes into, created when missing. */
  seriesName: string;
}

/**
 * Adds a book to a category. By-author categories keep a book under its author (`seriesId` is the author id, and the
 * author entry carries the category id); by-series categories keep it under a series, created when missing.
 */
export function insertBook(category: Category, book: Book, target: BookTarget, newId: () => string): Category {
  if (category.by === ViewBy.BY_SERIES) {
    const list = category.series ?? [];
    const existing = list.find(series => series.name === target.seriesName);
    const series: Series = existing ?? {
      id: newId(), name: target.seriesName, parentId: category.id, by: ViewBy.BY_SERIES, resume: '',
      status: SeriesStatus.IN_PROGRESS, authorIds: [], books: [],
    };
    const authorIds = series.authorIds.includes(target.authorId) ? series.authorIds : [...series.authorIds, target.authorId];
    const filled: Series = {...series, authorIds, books: [...(series.books ?? []), {...book, parentId: series.id, authorIds: [target.authorId]}]};
    return {...category, series: existing ? list.map(item => item === existing ? filled : item) : [...list, filled]};
  }
  const authors = category.authors ?? [];
  const existing = authors.find(author => author.id === target.authorId);
  const placed: Book = {...book, seriesId: target.authorId, authorIds: [target.authorId]} as Book;
  if (existing) {
    return {...category, authors: authors.map(author => author === existing ? {...author, books: [...(author.books ?? []), placed]} : author)};
  }
  const author = {
    id: target.authorId, firstName: target.firstName, lastName: target.lastName, categoryId: category.id, by: ViewBy.BY_AUTHOR,
    resume: '', books: [placed],
  } as Author;
  return {...category, authors: [...authors, author]};
}

const STOP = new Set(['de', 'du', 'des', 'la', 'le', 'les', 'van', 'von', 'di', 'da', 'del', 'et', 'the', 'of']);

function nameTokens(text: string): Set<string> {
  return new Set(text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().split(/[^a-z0-9]+/).filter(token => token && !STOP.has(token)));
}

/** The id of the author whose name (in any order: "Prénom Nom" or "NOM Prénom") matches `name`, if any. */
export function findAuthorId(authors: ReadonlyArray<Author> | undefined, name: string): string | undefined {
  const wanted = nameTokens(name);
  if (!wanted.size) {
    return undefined;
  }
  return (authors ?? []).find(author => {
    const known = nameTokens(`${author.firstName} ${author.lastName}`);
    return known.size === wanted.size && [...wanted].every(token => known.has(token));
  })?.id;
}

/** "Jean-Paul Sartre" -> first name "Jean-Paul", last name "Sartre" (the last word is the last name). */
export function splitPersonName(text: string): {firstName: string; lastName: string} {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length < 2 ? {firstName: '', lastName: words[0] ?? ''} : {firstName: words.slice(0, -1).join(' '), lastName: words[words.length - 1]};
}
