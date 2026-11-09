import {Book, BookStatus, Series} from '../../models/author.model';

export function isBookVisible(book: Book): boolean {
  return book.status !== BookStatus.DECLASSED && book.status !== BookStatus.MISSING;
}

/** Hides declassed and missing books unless the admin mode is on. */
export function filterBooks(books: ReadonlyArray<Book> | undefined, isAdmin: boolean): Array<Book> {
  return isAdmin ? [...(books ?? [])] : (books ?? []).filter(isBookVisible);
}

/** Keeps the series that still have at least one visible book (all of them in admin mode). */
export function filterSeries(series: ReadonlyArray<Series> | undefined, isAdmin: boolean): Array<Series> {
  return isAdmin ? [...(series ?? [])] : (series ?? []).filter(item => item.books?.some(isBookVisible));
}
