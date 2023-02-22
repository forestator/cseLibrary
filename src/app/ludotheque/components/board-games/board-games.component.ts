import {Component} from '@angular/core';
import {Library} from '../../../models/author.model';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-board-games',
  templateUrl: './board-games.component.html',
  styleUrls: ['./board-games.component.scss']
})
export class BoardGamesComponent {
  library$: Observable<Library> = this.firebaseDatabase.boardGamesLibrary$;
  constructor(private firebaseDatabase: FirebaseDatabaseService) { }
}
