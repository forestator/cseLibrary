import {ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {SeriesStatus} from '../../../models/author.model';
import {ToolsService} from '../../../services/biblio/tools.service';
import {countLabel} from '../../models/library-queries';
import {filterBooks} from '../../models/library-visibility';
import {BookCoverPipe} from '../../pipes/book-cover.pipe';
import {LibraryRepository} from '../../services/library.repository';
import {EmptyStateComponent} from '../common/empty-state/empty-state.component';
import {Crumb, PageHeaderComponent} from '../common/page-header/page-header.component';
import {SeriesBadgeComponent} from '../common/series-badge/series-badge.component';
import {SkeletonComponent} from '../common/skeleton/skeleton.component';
import {BookRowComponent} from './book-row/book-row.component';

@Component({
  selector: 'app-series-view',
  templateUrl: './series-view.component.html',
  styleUrl: './series-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, PageHeaderComponent, SeriesBadgeComponent, BookRowComponent, BookCoverPipe, SkeletonComponent, EmptyStateComponent],
})
export class SeriesViewComponent {
  private readonly repository = inject(LibraryRepository);
  protected readonly tools = inject(ToolsService);

  readonly libraryId = input<string>();
  readonly catId = input<string>();
  readonly seriesId = input<string>();
  /** Book to highlight and scroll to, from the `?book=` query parameter. */
  readonly book = input<string>();

  protected readonly activeBookId = linkedSignal(() => this.book());

  protected readonly biblio = computed(() => this.repository.libraryById(this.libraryId()));
  protected readonly category = computed(() =>
    this.biblio()?.library?.categories?.find(category => category.id === this.catId())
  );
  protected readonly series = computed(() =>
    this.category()?.series?.find(series => series.id === this.seriesId())
  );

  /** One-shot series list their latest book first. */
  protected readonly books = computed(() => {
    const series = this.series();
    const books = filterBooks(series?.books, this.tools.adminMode);
    return series?.status === SeriesStatus.ONE_SHOT ? books.reverse() : books;
  });

  protected readonly facts = computed(() => [countLabel(this.books().length, 'livre')]);

  protected readonly crumbs = computed<Array<Crumb>>(() => {
    const library = this.biblio()?.library;
    const category = this.category();
    return [
      {label: 'Bibliothèque', link: '/bibliotheque'},
      {label: library?.name ?? '', link: ['/bibliotheque', library?.id ?? '']},
      {label: category?.name ?? '', link: ['/bibliotheque', library?.id ?? '', category?.id ?? '']},
    ];
  });

  constructor() {
    effect(() => {
      const bookId = this.activeBookId();
      if (bookId && this.books().some(book => book.id === bookId)) {
        this.tools.scrollToId(bookId);
      }
    });
  }

  protected select(bookId?: string): void {
    this.activeBookId.set(bookId);
  }
}
