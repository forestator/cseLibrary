import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {Author, Biblio, Book, Series, ViewBy} from '../../../../models/author.model';
import {ToolsService} from '../../../../services/biblio/tools.service';
import {filterBooks} from '../../../models/library-visibility';
import {BookTableComponent} from '../../common/book-table/book-table.component';

interface SeriesWithBooks {
  series: Series;
  books: Array<Book>;
}

@Component({
  selector: 'app-author-row',
  templateUrl: './author-row.component.html',
  styleUrl: './author-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatExpansionModule, BookTableComponent],
})
export class AuthorRowComponent {
  private readonly adminMode = inject(ToolsService).adminMode;

  readonly author = input.required<Author>();
  readonly biblio = input.required<Biblio>();

  protected readonly books = computed(() => {
    const author = this.author();
    if (author.by === ViewBy.BY_AUTHOR) {
      return filterBooks(author.books, this.adminMode);
    }
    const categories = this.biblio().library?.categories ?? [];
    const authored = categories
      .flatMap(category => category.series ?? [])
      .flatMap(series => series.books ?? [])
      .filter(book => book.authorIds.includes(author.id));
    return filterBooks(authored, this.adminMode);
  });

  /** Series of the author that still have books to show. */
  protected readonly series = computed<Array<SeriesWithBooks>>(() => {
    const author = this.author();
    if (author.by !== ViewBy.BY_AUTHOR) {
      return [];
    }
    return (author.series ?? [])
      .map(series => ({series, books: filterBooks(series.books, this.adminMode)}))
      .filter(entry => entry.books.length > 0);
  });

  protected readonly counter = computed(() =>
    this.series().reduce((total, entry) => total + entry.books.length, this.books().length)
  );
}
