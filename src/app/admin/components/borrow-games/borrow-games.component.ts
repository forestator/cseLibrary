import {Component, ViewChild} from '@angular/core';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {MatSort} from '@angular/material/sort';
import {Observable} from 'rxjs';
import {BoardGame} from '../../../models/boardGame.model';

@Component({
  selector: 'app-borrow-games',
  templateUrl: './borrow-games.component.html',
  styleUrls: ['./borrow-games.component.scss']
})
export class BorrowGamesComponent {
  displayedColumnsBoardGames = ['status', 'category', 'name', 'poids', 'ref'];
  displayedColumnsVideoGame = ['status', 'category', 'name', 'ref'];
  displayedColumnsOutsideGame = ['status', 'name', 'ref'];
  @ViewChild(MatSort) sort?: MatSort;
  boardGamesSource$: Observable<Array<BoardGame>> = this.firebaseDatabaseService.boardGames$;
  search: string = '';
  boardGamePanelOpen: boolean = false;
  videoGamePanelOpen: boolean = false;
  outsideGamePanelOpen: boolean = false;

  constructor(public firebaseDatabaseService: FirebaseDatabaseService) {
  }
}
