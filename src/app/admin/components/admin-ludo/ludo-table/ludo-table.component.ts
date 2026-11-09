import {ChangeDetectionStrategy, Component, computed, input, signal} from '@angular/core';
import {Sort, MatSort, MatSortHeader} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {BadgeComponent} from '../../../../common/components/book-badge/badge.component';
import {BoardGame} from '../../../../models/boardGame.model';
import {Game} from '../../../../models/common.model';

@Component({
  selector: 'app-ludo-table',
  templateUrl: './ludo-table.component.html',
  styleUrl: './ludo-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatSort, MatSortHeader, BadgeComponent],
})
export class LudoTableComponent {
  readonly games = input<ReadonlyArray<Game>>();
  readonly displayedColumns = input.required<ReadonlyArray<string>>();
  readonly filterBy = input<string>();

  private readonly sort = signal<Sort>({active: '', direction: ''});

  protected readonly rows = computed(() => {
    const games = this.games();
    if (!games) {
      return undefined;
    }
    const filterBy = this.filterBy()?.toLowerCase();
    const filteredGames = filterBy ? games.filter(game => game.name.toLowerCase().includes(filterBy)) : [...games];
    return this.sortGames(filteredGames, this.sort());
  });

  protected sortData(sort: Sort): void {
    this.sort.set(sort);
  }

  private sortGames(games: Array<Game>, sort: Sort): Array<Game> {
    if (!sort.active || sort.direction === '') {
      return games;
    }
    const isAsc = sort.direction === 'asc';
    return games.sort((first, second) => {
      switch (sort.active) {
        case 'category':
          return this.compare(first.category, second.category, isAsc);
        case 'name':
          return this.compare(first.name, second.name, isAsc);
        case 'weight':
          if ('weight' in first && 'weight' in second) {
            return this.compare((first as BoardGame).weight, (second as BoardGame).weight, isAsc);
          }
          return 0;
        case 'ref':
          return this.compare(first.ref, second.ref, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(first: number | string, second: number | string, isAsc: boolean): number {
    return (first < second ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
