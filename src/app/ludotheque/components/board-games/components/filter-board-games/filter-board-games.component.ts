import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {FilterBoardGamesService} from '../../../../services/filter-board-games.service';
import {AdvancedBoardGameFilter, BoardGameFilterType} from '../../../../../models/boardGame.model';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';

@Component({
    selector: 'app-filter-board-games',
    templateUrl: './filter-board-games.component.html',
    styleUrls: ['./filter-board-games.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatIcon, MatButtonToggleGroup, MatButtonToggle]
})
export class FilterBoardGamesComponent {
  private filterService = inject(FilterBoardGamesService);

  numberOfPlayers: Array<string> = ['1', '2', '3', '4', '5', '6', '7', '8', '8+'];
  gameDuration: Array<string> = ['moins de 15min', 'de 15 à 30min', 'de 30 à 1h', 'plus d\'1h'];
  ageList: Array<string> = ['2', '4', '7', '10', '12', '14', '16'];
  boardGameFilterType = BoardGameFilterType;
  currentFilter: AdvancedBoardGameFilter = {age: null, duration: null, nbPlayers: null};

  numberOfPlayersGroupValue: string;
  durationGroupValue: string;
  ageGroupValue: string;

  selectedFilter(value: string, filterType: BoardGameFilterType) {
    const convertedVal =
      filterType === BoardGameFilterType.DURATION ? this.convertDurationFilterBeforeSend(value) : value;
    // already selected filter should remove it
    if (this.currentFilter[filterType] === convertedVal) {
      this.currentFilter[filterType] = null;
      switch (filterType) {
        case BoardGameFilterType.AGE:
          this.ageGroupValue = null;
          break;
        case BoardGameFilterType.DURATION:
          this.durationGroupValue = null;
          break;
        case BoardGameFilterType.NUMBER_OF_PLAYERS:
          this.numberOfPlayersGroupValue = null;
          break;
      }
    } else {
      this.currentFilter[filterType] = convertedVal;
    }

    this.filterService.filter$.next(this.currentFilter);
  }

  private convertDurationFilterBeforeSend(value: string): string {
    let returnedValue: string;
    if (value.includes('15')) {
      if (value.includes('30')) {
        returnedValue = '15>30';
      } else {
        returnedValue = '<15';
      }
    } else if (!value.includes('15') && value.includes('30')) {
      returnedValue = '30>60';
    } else {
      returnedValue = '>60';
    }
    return returnedValue;
  }
}
