import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {SeriesStatus} from '../../../models/author.model';
import {BadgeComponent} from '../../../common/components/book-badge/badge.component';
import {ToolsService} from '../../../services/biblio/tools.service';
import {filterBooks} from '../../models/library-visibility';
import {BookCoverPipe} from '../../pipes/book-cover.pipe';
import {LibraryRepository} from '../../services/library.repository';
import {SeriesBadgeComponent} from '../common/series-badge/series-badge.component';
import {BookRowComponent} from './book-row/book-row.component';

@Component({
  selector: 'app-series-view',
  templateUrl: './series-view.component.html',
  styleUrl: './series-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, RouterLink, SeriesBadgeComponent, BadgeComponent, BookRowComponent, BookCoverPipe],
})
export class SeriesViewComponent {
  private readonly repository = inject(LibraryRepository);
  private readonly adminMode = inject(ToolsService).adminMode;
  protected readonly tools = inject(ToolsService);

  /** Route parameters. */
  readonly libraryId = input<string>();
  readonly catId = input<string>();
  readonly seriesId = input<string>();

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
    const books = filterBooks(series?.books, this.adminMode);
    return series?.status === SeriesStatus.ONE_SHOT ? books.reverse() : books;
  });
}
