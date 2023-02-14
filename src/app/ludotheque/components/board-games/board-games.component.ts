import {Component} from '@angular/core';
import {Library} from '../../../models/author.model';
import boardGame from '../../../../assets/ludo/boardGameLib.json';

@Component({
  selector: 'app-board-games',
  templateUrl: './board-games.component.html',
  styleUrls: ['./board-games.component.scss']
})
export class BoardGamesComponent {
  library: Library = boardGame.library as Library;
  constructor() { }
}
