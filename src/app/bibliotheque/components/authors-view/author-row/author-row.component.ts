import { Component, OnInit, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import {map, Observable, take} from 'rxjs';
import {Author, Biblio, Book, BookStatus, SelectorView, Series, ViewBy, ViewMode} from 'src/app/models/author.model';
import {BookFilterPipe} from 'src/app/pipes/book-filter.pipe';
import {DataService} from 'src/app/services/biblio/data.service';
import {ToolsService} from 'src/app/services/biblio/tools.service';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { BadgeComponent } from '../../../../common/components/book-badge/badge.component';
import { AsyncPipe } from '@angular/common';
import { BookFilterPipe as BookFilterPipe_1 } from '../../../../pipes/book-filter.pipe';
import { BookCoverPipe } from '../../../pipes/book-cover.pipe';

@Component({
    selector: 'app-author-row',
    templateUrl: './author-row.component.html',
    styleUrls: ['./author-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, BadgeComponent, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, AsyncPipe, BookFilterPipe_1, BookCoverPipe]
})
export class AuthorRowComponent implements OnInit {
  dataService = inject(DataService);
  tools = inject(ToolsService);
  bookFilter = inject(BookFilterPipe);


  readonly author = input.required<Author>();
  readonly biblio = input<Biblio>(undefined);
  readonly sendView = output<SelectorView>();

  public books!: Array<Book> | undefined;
  public series!: Array<Series> | undefined;
  public counter: number;
  id!: string;

  bookColumns: Array<string> = ['cover', 'title', 'tome', 'isbn', 'page', 'status'];
  seriesBookColumns: Array<string> = ['cover', 'title', 'series', 'tome', 'isbn', 'page', 'status'];

  constructor() {
    this.counter = 0;
  }

  ngOnInit(): void {
    this.counter = 0;
    this.books = [];
    const author = this.author();
    this.id = author.lastName[0] ? author.lastName[0].toUpperCase() : '??';
    const authorValue = this.author();
    if (authorValue.by === ViewBy.BY_AUTHOR) {
      if (authorValue.books?.length) {
        let filteredBooks: Array<Book> = this.bookFilter.transform(authorValue?.books, this.tools.adminMode);
        this.books.push(...filteredBooks);
        this.counter += filteredBooks.length;
        this.series = authorValue.series;
        if (this.series?.length) {
          this.series?.forEach(s => {
            let filteredBooks: Array<Book> = this.bookFilter.transform(s.books, this.tools.adminMode);
            this.counter += filteredBooks.length;
          })
        }
      }
    } else {
      this.getBooksByAuthor(authorValue.id).pipe(
        map(books => {
          this.books = books;
          this.series = undefined;
          this.counter += books.length;
        }),
        take(1)
      ).subscribe();
    }
  }

  private getBooksByAuthor(authorId: string | undefined): Observable<Array<Book>> {
    return new Observable<Array<Book>>(observer => {
      const books: Array<Book> = [];
      this.biblio().library?.categories?.forEach(category => {
        category.series?.forEach(series => {
          series.books?.forEach(book => {
            if (book.authorIds.includes(authorId)) {
              if (this.tools.adminMode) {
                books.push(book);
              } else {
                if (book.status !== BookStatus.DECLASSED && book.status !== BookStatus.MISSING) {
                  books.push(book);
                }
              }
            }
          });
        });
      });
      observer.next(books);
    });
  }

  public selectBook(bookId: string) {
    console.log('select book ', bookId);
    this.sendView.emit({ mode: ViewMode.BY_BOOK, id: bookId });
  }

  public selectAuthor() {
    const author = this.author();
    if (author.by === ViewBy.BY_AUTHOR) {
      console.log('select author');
      this.sendView.emit({ mode: ViewMode.BY_AUTHOR, id: author.id });
    }
  }

}
