import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {ViewBy} from '../../../models/author.model';
import {ToolsService} from '../../../services/biblio/tools.service';
import {countLabel, visibleBookCount} from '../../models/library-queries';
import {filterBooks, filterSeries} from '../../models/library-visibility';
import {LibraryRepository} from '../../services/library.repository';
import {AuthorRowComponent} from './author-row/author-row.component';
import {AlphabetComponent} from '../common/alphabet/alphabet.component';
import {EmptyStateComponent} from '../common/empty-state/empty-state.component';
import {Crumb, PageHeaderComponent} from '../common/page-header/page-header.component';
import {SkeletonComponent} from '../common/skeleton/skeleton.component';
import {SeriesRowComponent} from './series-row/series-row.component';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrl: './category-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlphabetComponent, SeriesRowComponent, AuthorRowComponent, PageHeaderComponent, SkeletonComponent, EmptyStateComponent],
})
export class CategoryViewComponent {
  private readonly repository = inject(LibraryRepository);
  private readonly adminMode = inject(ToolsService).adminMode;

  readonly libraryId = input<string>();
  readonly catId = input<string>();

  protected readonly isByAuthor = computed(() => this.category()?.by === ViewBy.BY_AUTHOR);
  protected readonly filterLetter = signal<string | undefined>(undefined);

  protected readonly biblio = computed(() => this.repository.libraryById(this.libraryId()));
  protected readonly category = computed(() =>
    this.biblio()?.library?.categories?.find(category => category.id === this.catId())
  );

  protected readonly crumbs = computed<Array<Crumb>>(() => {
    const library = this.biblio()?.library;
    return [
      {label: 'Bibliothèque', link: '/bibliotheque'},
      {label: library?.name ?? '', link: ['/bibliotheque', library?.id ?? '']},
    ];
  });

  protected readonly facts = computed(() => {
    const category = this.category();
    return category ? [countLabel(visibleBookCount([category], this.adminMode), 'livre')] : [];
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
