import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {BoardGame} from '../../../../../models/boardGame.model';
import { BoardGameRowComponent } from '../board-game-row/board-game-row.component';
import { AsyncPipe } from '@angular/common';
import { AdvancedBoardGameFilterPipe } from '../../../../pipes/advanced-board-game-filter.pipe';

@Component({
    selector: 'app-board-game-category-details',
    templateUrl: './board-game-category-details.component.html',
    styleUrls: ['./board-game-category-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [BoardGameRowComponent, AsyncPipe, AdvancedBoardGameFilterPipe]
})
export class BoardGameCategoryDetailsComponent {

  @Input() boardGames?: Array<BoardGame> | null;
  @Input() selectedBoardGameId?: string;
  @Input() categoryId?: string;


  trackBoardGame(index: number, item: BoardGame) {
    return item.id + item.name;
  }
}
