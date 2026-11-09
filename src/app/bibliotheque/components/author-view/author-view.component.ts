import {Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy} from '@angular/core';
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

  @Input()
  biblio!: Biblio | undefined;

  @Input()
  category!: Category | undefined;

  @Input()
  author!: Author | undefined;

  @Output() sendView = new EventEmitter<SelectorView>();

  counter: number = 0;
  books!: Array<Book>;

  constructor(public tools: ToolsService, private bookFilter: BookFilterPipe) { }

  ngOnInit(): void {
    this.books = [];
    this.counter = 0;
    if (this.author?.books?.length) {
      let filterBook: Array<Book> = this.bookFilter.transform(this.author?.books, this.tools.adminMode);
      this.counter += filterBook.length;
      this.books.push(...filterBook);
    }
    if (this.author?.series?.length) {
      this.author?.series?.forEach(series => {
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
