import {Author, Biblio, Book, BookPath, BookStatus} from '../../models/author.model';

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
