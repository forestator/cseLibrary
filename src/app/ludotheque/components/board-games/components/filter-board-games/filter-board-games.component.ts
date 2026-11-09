import {ChangeDetectionStrategy, Component, inject, signal, WritableSignal} from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatIcon} from '@angular/material/icon';
import {AdvancedBoardGameFilter, BoardGameFilterType} from '../../../../../models/boardGame.model';
import {FilterBoardGamesService} from '../../../../services/filter-board-games.service';

interface FilterGroup {
  type: BoardGameFilterType;
  icon: string;
  title: string;
  ariaLabel: string;
  unit: string;
  options: ReadonlyArray<string>;
  selected: WritableSignal<string | null>;
}

@Component({
  selector: 'app-filter-board-games',
  templateUrl: './filter-board-games.component.html',
  styleUrl: './filter-board-games.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatButtonToggleGroup, MatButtonToggle],
})
export class FilterBoardGamesComponent {
  private readonly filterService = inject(FilterBoardGamesService);

  protected readonly groups: ReadonlyArray<FilterGroup> = [
    {
      type: BoardGameFilterType.NUMBER_OF_PLAYERS, icon: 'group', title: 'Nombre de joueurs',
      ariaLabel: 'Number of players', unit: '',
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '8+'], selected: signal<string | null>(null),
    },
    {
      type: BoardGameFilterType.DURATION, icon: 'timer', title: 'Durée d\'une partie',
      ariaLabel: 'Game duration', unit: '',
      options: ['moins de 15min', 'de 15 à 30min', 'de 30 à 1h', 'plus d\'1h'], selected: signal<string | null>(null),
    },
    {
      type: BoardGameFilterType.AGE, icon: 'family_restroom', title: 'Âge, à partir de',
      ariaLabel: 'Player Age', unit: ' ans',
      options: ['2', '4', '7', '10', '12', '14', '16'], selected: signal<string | null>(null),
    },
  ];

  private currentFilter: AdvancedBoardGameFilter = {age: null, duration: null, nbPlayers: null};

  protected selectedFilter(group: FilterGroup, value: string): void {
    const convertedValue = group.type === BoardGameFilterType.DURATION ? this.convertDuration(value) : value;
    // Clicking the already selected value removes the filter.
    if (this.currentFilter[group.type] === convertedValue) {
      this.currentFilter[group.type] = null;
      group.selected.set(null);
    } else {
      this.currentFilter[group.type] = convertedValue;
    }
    this.filterService.filter.set({...this.currentFilter});
  }

  private convertDuration(value: string): string {
    if (value.includes('15')) {
      return value.includes('30') ? '15>30' : '<15';
    }
    return value.includes('30') ? '30>60' : '>60';
  }
}
