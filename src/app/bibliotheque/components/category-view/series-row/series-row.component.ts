import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {Biblio, Series} from '../../../../models/author.model';
import {ToolsService} from '../../../../services/biblio/tools.service';
import {filterBooks} from '../../../models/library-visibility';
import {BookTableComponent} from '../../common/book-table/book-table.component';
import {SeriesBadgeComponent} from '../../common/series-badge/series-badge.component';

@Component({
  selector: 'app-series-row',
  templateUrl: './series-row.component.html',
  styleUrl: './series-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatExpansionModule, SeriesBadgeComponent, BookTableComponent],
})
export class SeriesRowComponent {
  private readonly tools = inject(ToolsService);

  readonly series = input.required<Series>();
  readonly biblio = input.required<Biblio>();

  protected readonly visibleBooks = computed(() => filterBooks(this.series().books, this.tools.adminMode));
}
