import { Component, EventEmitter, OnInit, Output, ChangeDetectionStrategy, inject, input } from '@angular/core';
import {Author, Biblio, Book, BookStatus, Category, SelectorView, ViewBy, ViewMode} from 'src/app/models/author.model';
import {BookFilterPipe} from 'src/app/pipes/book-filter.pipe';
import {ToolsService} from 'src/app/services/biblio/tools.service';
import { MatIcon } from '@angular/material/icon';
import { BadgeComponent } from '../../../common/components/book-badge/badge.component';
import { BookRowComponent } from '../series-view/book-row/book-row.component';
import { AsyncPipe } from '@angular/common';
import { BookCoverPipe } from '../../pipes/book-cover.pipe';

@Component({
    selector: 'app-author-view',
    templateUrl: './author-view.component.html',
    styleUrls: ['./author-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatIcon, BadgeComponent, BookRowComponent, AsyncPipe, BookCoverPipe]
})
export class AuthorViewComponent implements OnInit {
  tools = inject(ToolsService);
  private bookFilter = inject(BookFilterPipe);

  private BOOK_SEPARATOR: Book = {
    id: undefined,
    by: ViewBy.BY_AUTHOR,
    name: '',
    status: BookStatus.SEPARATOR,
    resume: '',
    authorIds: [],
    isbn10: '',
    isbn13: '',
    cover: '',
    format: '',
    page: '',
    publisherId: '',
    ref: '',
    tome: '',
    date: '',
    year: ''
  }

  readonly biblio = input.required<Biblio | undefined>();

  readonly category = input.required<Category | undefined>();

  readonly author = input.required<Author | undefined>();

  @Output() sendView = new EventEmitter<SelectorView>();

  counter: number = 0;
  books!: Array<Book>;

  ngOnInit(): void {
    this.books = [];
    this.counter = 0;
    const author = this.author();
    if (author?.books?.length) {
      let filterBook: Array<Book> = this.bookFilter.transform(author?.books, this.tools.adminMode);
      this.counter += filterBook.length;
      this.books.push(...filterBook);
    }
    if (author?.series?.length) {
      author?.series?.forEach(series => {
        if (series.books?.length) {
          let filterBook: Array<Book> = this.bookFilter.transform(series.books, this.tools.adminMode);
          this.counter += filterBook.length;
          let separator: Book = JSON.parse(JSON.stringify(this.BOOK_SEPARATOR));
          separator.name = series.name;
          separator.resume = series.resume;
          this.books.push(this.BOOK_SEPARATOR);
          this.books.push(...filterBook);
        }
      });
    }
    console.log('books: ', this.books);
  }

  selectLibrary(id: string | undefined) {
    this.sendView.emit({ mode: ViewMode.BY_LIBRARY, id: id });
  }

  selectCategory(id: string | undefined) {
    this.sendView.emit({ mode: ViewMode.BY_CATEGORY, id: id });
  }
}
