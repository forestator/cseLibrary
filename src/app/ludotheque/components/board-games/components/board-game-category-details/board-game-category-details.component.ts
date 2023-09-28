import {Component, Input} from '@angular/core';
import {BoardGame} from '../../../../../models/boardGame.model';
import {BorrowDataService} from '../../../../../admin/services/borrow-data.service';
import {Comissions} from '../../../../../models/common.model';
import {Observable} from 'rxjs';
import {BorrowByComission} from '../../../../../admin/models/borrow.model';

@Component({
  selector: 'app-board-game-category-details',
  templateUrl: './board-game-category-details.component.html',
  styleUrls: ['./board-game-category-details.component.scss']
})
export class BoardGameCategoryDetailsComponent {

  @Input() boardGames?: Array<BoardGame> | null;
  @Input() selectedBoardGameId?: string;
  @Input() categoryId?: string;

  ludoBorrowInformations$: Observable<BorrowByComission[]>;

  constructor(private borrowDataService: BorrowDataService) {
    this.ludoBorrowInformations$ = this.borrowDataService.getBorrowsOfComission(Comissions.LUDOTHEQUE);
  }

  trackBoardGame(index: number, item: BoardGame) {
    return item.id + item.name + item.status;
  }
}
