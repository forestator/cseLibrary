import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {ViewBy} from '../../../models/author.model';
import {ToolsService} from '../../../services/biblio/tools.service';
import {filterBooks, filterSeries} from '../../models/library-visibility';
import {LibraryRepository} from '../../services/library.repository';
import {AuthorRowComponent} from './author-row/author-row.component';
import {AlphabetComponent} from '../common/alphabet/alphabet.component';
import {SeriesRowComponent} from './series-row/series-row.component';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrl: './category-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, AlphabetComponent, RouterLink, SeriesRowComponent, AuthorRowComponent],
})
export class CategoryViewComponent {
  private readonly repository = inject(LibraryRepository);
  private readonly adminMode = inject(ToolsService).adminMode;

  /** Route parameters. */
  readonly libraryId = input<string>();
  readonly catId = input<string>();

  protected readonly isByAuthor = computed(() => this.category()?.by === ViewBy.BY_AUTHOR);
  protected readonly filterLetter = signal<string | undefined>(undefined);

  protected readonly biblio = computed(() => this.repository.libraryById(this.libraryId()));
  protected readonly category = computed(() =>
    this.biblio()?.library?.categories?.find(category => category.id === this.catId())
  );

  /** Counts every book of the category, visible or not; authors categories are not counted. */
  protected readonly counter = computed(() => {
    const category = this.category();
    if (category?.by !== ViewBy.BY_SERIES) {
      return 0;
    }
    return (category.series ?? []).reduce((total, series) => total + (series.books?.length ?? 0), 0);
  });

  protected readonly seriesList = computed(() =>
    filterSeries(this.category()?.series, this.adminMode).map(series => ({
      series,
      bookCount: filterBooks(series.books, this.adminMode).length,
    }))
  );

  protected readonly authors = computed(() => {
    const authors = this.category()?.authors ?? [];
    const letter = this.filterLetter();
    return letter
      ? authors.filter(author => author.firstName.startsWith(letter) || author.lastName.startsWith(letter))
      : authors;
  });
}
