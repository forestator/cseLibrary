import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {Biblio, Book} from '../../../../models/author.model';
import {AuthorNamesPipe} from '../../../pipes/author-names.pipe';
import {BookCoverPipe} from '../../../pipes/book-cover.pipe';
import {BookStatusComponent} from '../book-status/book-status.component';

/** Compact list of books: cover, title, authors, tome, ISBN, pages and status. */
@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, BookStatusComponent, AuthorNamesPipe, BookCoverPipe],
})
export class BookListComponent {
  readonly books = input.required<ReadonlyArray<Book>>();
  readonly biblio = input.required<Biblio>();
  readonly showAuthors = input(false);
  readonly highlightedBookId = input<string>();
}
