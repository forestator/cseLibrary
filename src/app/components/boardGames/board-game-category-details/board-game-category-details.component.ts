import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {LudoGame} from '../../../models/boardGame.model';

@Component({
  selector: 'app-board-game-category-details',
  templateUrl: './board-game-category-details.component.html',
  styleUrls: ['./board-game-category-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardGameCategoryDetailsComponent implements OnInit {

  @Input() boardGames: Array<LudoGame> = [];
  constructor() { }

  ngOnInit(): void {
  }

  trackBoardGame(index: number, item: LudoGame){
    return item.id + item.name;
  }
}
