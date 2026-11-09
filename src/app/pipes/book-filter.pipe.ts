import { Pipe, PipeTransform } from '@angular/core';
import { Book, BookStatus, SeriesStatus } from '../models/author.model';

@Pipe({ name: 'bookFilter' })
export class BookFilterPipe implements PipeTransform {

  transform(books: Array<Book> | undefined, isAdmin: boolean): Array<Book> {
    let result: Array<Book> = [];
    if (books) {
      if (isAdmin) {
        result = books;
      } else {
        result = books.filter(item => item.status !== BookStatus.DECLASSED && item.status !== BookStatus.MISSING);
      }
    }
    return result;
  }
}
