import {Component} from '@angular/core';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';

@Component({
  selector: 'app-admin-games',
  templateUrl: './admin-games.component.html',
  styleUrls: ['./admin-games.component.scss']
})
export class AdminGamesComponent {
  columnsBoardGames = ['status', 'category', 'name', 'poids', 'ref'];
  columnsVideoGame = ['status', 'category', 'name', 'ref'];
  columnsOutsideGame = ['status', 'category', 'name', 'ref'];
  search: string = '';
  boardGamePanelOpen: boolean = false;
  videoGamePanelOpen: boolean = false;
  outsideGamePanelOpen: boolean = false;


  constructor(public firebaseDatabaseService: FirebaseDatabaseService) {
  }
}
