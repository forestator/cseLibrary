import {Component, ViewChild} from '@angular/core';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {MatSort} from '@angular/material/sort';
import {Observable} from 'rxjs';
import {BoardGame} from '../../../models/boardGame.model';
import {UserService} from '../../../services/firebase/user.service';

@Component({
  selector: 'app-borrow-games',
  templateUrl: './borrow-games.component.html',
  styleUrls: ['./borrow-games.component.scss']
})
export class BorrowGamesComponent {
  displayedColumnsBoardGames = ['status', 'borrowedBy', 'category', 'name', 'poids', 'ref'];
  displayedColumnsVideoGame = ['status', 'borrowedBy', 'category', 'name', 'ref'];
  displayedColumnsOutsideGame = ['status', 'borrowedBy', 'name', 'ref'];
  @ViewChild(MatSort) sort?: MatSort;
  boardGamesSource$: Observable<Array<BoardGame>> = this.firebaseDatabaseService.boardGames$;
  search: string = '';
  boardGamePanelOpen: boolean = false;
  videoGamePanelOpen: boolean = false;
  outsideGamePanelOpen: boolean = false;

  constructor(public firebaseDatabaseService: FirebaseDatabaseService,
              public userService: UserService) {
  }
}
