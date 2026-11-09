import {Author, Biblio, Book, BookPath, BookStatus, Category} from '../../models/author.model';
import {filterBooks} from './library-visibility';

export function authorNames(authorIds: ReadonlyArray<string | undefined> | undefined, biblio?: Biblio): string {
  return (authorIds ?? [])
    .map(authorId => biblio?.authors?.find(author => author.id === authorId))
    .filter((author): author is Author => !!author)
    .map(author => `${author.firstName} ${author.lastName}`)
    .join(', ');
}

export function publisherName(publisherId: string | undefined, biblio?: Biblio): string {
  return publisherId ? (biblio?.publishers?.find(publisher => publisher.id === publisherId)?.name ?? '') : '';
}

/** Every book of the library with the given status, along with the category and series holding it. */
export function booksWithStatus(biblio: Biblio, status: BookStatus): Array<BookPath> {
  return (biblio.library?.categories ?? []).flatMap(category =>
    (category.series ?? []).flatMap(series =>
      (series.books ?? [])
        .filter((book: Book) => book.status === status)
        .map(book => ({category, series, book}))
    )
  );
}

/** Every book of a category, whether it hangs under a series or under an author, without duplicates. */
export function categoryBooks(category: Category): Array<Book> {
  const books = [
    ...(category.series ?? []).flatMap(series => series.books ?? []),
    ...(category.authors ?? []).flatMap(author => [
      ...(author.books ?? []),
      ...(author.series ?? []).flatMap(series => series.books ?? []),
    ]),
  ];
  return [...new Map(books.map(book => [book.id, book])).values()];
}

/** Number of books a visitor sees (all of them in admin mode) in the given categories. */
export function visibleBookCount(categories: ReadonlyArray<Category> | undefined, isAdmin: boolean): number {
  const books = (categories ?? []).flatMap(category => categoryBooks(category));
  return filterBooks([...new Map(books.map(book => [book.id, book])).values()], isAdmin).length;
}

/** "1 livre", "12 livres": French plural with a regular `s`. */
export function countLabel(count: number, unit: string): string {
  return `${count} ${unit}${count > 1 ? 's' : ''}`;
}
