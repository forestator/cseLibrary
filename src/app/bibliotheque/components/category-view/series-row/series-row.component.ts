import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {Biblio, Series} from '../../../../models/author.model';
import {ToolsService} from '../../../../services/biblio/tools.service';
import {countLabel} from '../../../models/library-queries';
import {filterBooks} from '../../../models/library-visibility';
import {BookListComponent} from '../../common/book-list/book-list.component';
import {SeriesBadgeComponent} from '../../common/series-badge/series-badge.component';

/** Collapsible card of a series: badge, size and link in the header, resume and books once opened. */
@Component({
  selector: 'app-series-row',
  templateUrl: './series-row.component.html',
  styleUrl: './series-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIcon, SeriesBadgeComponent, BookListComponent],
})
export class SeriesRowComponent {
  private readonly tools = inject(ToolsService);

  readonly series = input.required<Series>();
  readonly biblio = input.required<Biblio>();

  protected readonly open = signal(false);
  protected readonly visibleBooks = computed(() => filterBooks(this.series().books, this.tools.adminMode));
  protected readonly bookCount = computed(() => countLabel(this.visibleBooks().length, 'livre'));
  protected readonly panelId = computed(() => `series-panel-${this.series().id}`);
  protected readonly toggleLabel = computed(() => `${this.open() ? 'Masquer' : 'Afficher'} les livres de la série ${this.series().name}`);
  protected readonly linkLabel = computed(() => `Ouvrir la page de la série ${this.series().name}`);
}
