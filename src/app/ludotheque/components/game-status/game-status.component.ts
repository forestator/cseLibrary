import {Component, Input, OnInit} from '@angular/core';
import {BorrowInfo, Game, LudoStatus} from '../../../models/common.model';
import {GamesUtils} from '../../../models/gamesUtils';

@Component({
  selector: 'app-game-status',
  templateUrl: './game-status.component.html',
  styleUrls: ['./game-status.component.scss']
})
export class GameStatusComponent implements OnInit {

  @Input() game: Game;

  gameStatus: LudoStatus = LudoStatus.AVAILABLE;

  ngOnInit() {
    if (this.game.borrowList) {
      const emprunte: BorrowInfo | undefined =
        GamesUtils.gameIsReservedOrEmprunte(this.game.borrowList, new Date(), true);
      if (emprunte) {
        this.gameStatus = LudoStatus.EMPRUNTE;
      } else {
        const reservedForNextSession = GamesUtils.reservedForNextSession(this.game.borrowList);
        if (reservedForNextSession) {
          this.gameStatus = LudoStatus.RESERVED;
        }
      }
    }
  }
}
