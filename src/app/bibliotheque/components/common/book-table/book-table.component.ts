import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {Biblio, Book} from '../../../../models/author.model';
import {BadgeComponent} from '../../../../common/components/book-badge/badge.component';
import {AuthorNamesPipe} from '../../../pipes/author-names.pipe';
import {BookCoverPipe} from '../../../pipes/book-cover.pipe';

/** Table of books shared by the series and author rows; optional columns depend on the context. */
@Component({
  selector: 'app-book-table',
  templateUrl: './book-table.component.html',
  styleUrl: './book-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, BadgeComponent, AuthorNamesPipe, BookCoverPipe],
})
export class BookTableComponent {
  readonly books = input.required<ReadonlyArray<Book>>();
  readonly biblio = input.required<Biblio>();
  readonly showAuthors = input(false);
  /** When set, adds a column repeating the name of the series the books belong to. */
  readonly seriesName = input<string>();

  protected readonly columns = computed(() => [
    'cover',
    'title',
    ...(this.showAuthors() ? ['authors'] : []),
    ...(this.seriesName() === undefined ? [] : ['series']),
    'tome',
    'isbn',
    'page',
    'status',
  ]);
}
