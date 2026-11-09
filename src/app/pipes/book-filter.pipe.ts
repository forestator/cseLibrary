import {Pipe, PipeTransform} from '@angular/core';
import {Book, BookStatus} from '../models/author.model';

export function isBookVisible(book: Book): boolean {
  return book.status !== BookStatus.DECLASSED && book.status !== BookStatus.MISSING;
}

/** Hides declassed and missing books unless the admin mode is on. */
export function filterBooks(books: ReadonlyArray<Book> | undefined, isAdmin: boolean): Array<Book> {
  return isAdmin ? [...(books ?? [])] : (books ?? []).filter(isBookVisible);
}

@Pipe({name: 'bookFilter'})
export class BookFilterPipe implements PipeTransform {
  transform(books: ReadonlyArray<Book> | undefined, isAdmin: boolean): Array<Book> {
    return filterBooks(books, isAdmin);
  }
}
