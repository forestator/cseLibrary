import {Component, Input} from '@angular/core';
import {BoardGame} from '../../../../../models/boardGame.model';

@Component({
  selector: 'app-board-game-category-details',
  templateUrl: './board-game-category-details.component.html',
  styleUrls: ['./board-game-category-details.component.scss']
})
export class BoardGameCategoryDetailsComponent {

  @Input() boardGames?: Array<BoardGame> | null;
  @Input() selectedBoardGameId?: string;
  @Input() categoryId?: string;


  trackBoardGame(index: number, item: BoardGame) {
    return item.id + item.name;
  }
}
