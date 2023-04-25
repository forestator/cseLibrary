import {Component, Input} from '@angular/core';
import {Game, LudoStatus} from '../../../models/common.model';

@Component({
  selector: 'app-game-status',
  templateUrl: './game-status.component.html',
  styleUrls: ['./game-status.component.scss']
})
export class GameStatusComponent {

  @Input() game: Game;

  gameStatus: LudoStatus = LudoStatus.AVAILABLE;
}
