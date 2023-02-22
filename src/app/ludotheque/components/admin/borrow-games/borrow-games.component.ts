import {Component} from '@angular/core';
import {FirebaseDatabaseService} from '../../../../services/firebase/firebase-database.service';

@Component({
  selector: 'app-borrow-games',
  templateUrl: './borrow-games.component.html',
  styleUrls: ['./borrow-games.component.scss']
})
export class BorrowGamesComponent {
  displayedColumns = ['status', 'category','name','poids','ref'];
  displayedColumnsVideoGame = ['status', 'category','name', 'ref'];
  constructor(public firebaseDatabaseService: FirebaseDatabaseService) {

  }
}
