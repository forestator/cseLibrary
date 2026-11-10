import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {AdvancedBoardGameFilter, BoardGameFilterType} from '../../../../../models/boardGame.model';
import {FilterBoardGamesService} from '../../../../services/filter-board-games.service';

interface FilterOption {
  label: string;
  /** Value stored in the filter, which differs from the label for durations. */
  value: string;
}

interface FilterGroup {
  type: BoardGameFilterType;
  icon: string;
  title: string;
  options: ReadonlyArray<FilterOption>;
}

const plain = (values: ReadonlyArray<string>, unit = ''): ReadonlyArray<FilterOption> =>
  values.map(value => ({label: `${value}${unit}`, value}));

const GROUPS: ReadonlyArray<FilterGroup> = [
  {
    type: BoardGameFilterType.NUMBER_OF_PLAYERS, icon: 'group', title: 'Nombre de joueurs',
    options: plain(['1', '2', '3', '4', '5', '6', '7', '8', '8+']),
  },
  {
    type: BoardGameFilterType.DURATION, icon: 'timer', title: 'Durée d\'une partie',
    options: [
      {label: 'moins de 15 min', value: '<15'},
      {label: '15 à 30 min', value: '15>30'},
      {label: '30 min à 1 h', value: '30>60'},
      {label: 'plus d\'1 h', value: '>60'},
    ],
  },
  {
    type: BoardGameFilterType.AGE, icon: 'family_restroom', title: 'Âge, à partir de',
    options: plain(['2', '4', '7', '10', '12', '14', '16'], ' ans'),
  },
];

/** Chips filtering the board games of the page; the selection lives in the service so it survives navigation. */
@Component({
  selector: 'app-filter-board-games',
  templateUrl: './filter-board-games.component.html',
  styleUrl: './filter-board-games.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class FilterBoardGamesComponent {
  private readonly filterService = inject(FilterBoardGamesService);

  protected readonly groups = computed(() => {
    const filter = this.filterService.filter();
    return GROUPS.map(group => ({
      ...group,
      options: group.options.map(option => ({...option, pressed: filter[group.type] === option.value})),
    }));
  });

  protected readonly hasFilter = computed(() => this.filterService.activeCount() > 0);

  protected toggle(type: BoardGameFilterType, value: string): void {
    // Clicking the already selected value removes the filter.
    this.filterService.filter.update(filter => ({...filter, [type]: filter[type] === value ? null : value}));
  }

  protected reset(): void {
    const empty: AdvancedBoardGameFilter = {age: null, duration: null, nbPlayers: null};
    this.filterService.filter.set(empty);
  }
}
