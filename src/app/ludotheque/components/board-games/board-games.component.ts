import {Component} from '@angular/core';
import {Library} from '../../../models/author.model';
import {FirebaseDatabaseService} from '../../../services/firebase-database.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {NavigationService} from '../../../services/navigation.service';

@Component({
  selector: 'app-board-games',
  templateUrl: './board-games.component.html',
  styleUrls: ['./board-games.component.scss']
})
export class BoardGamesComponent {
  library$: Observable<Library> = this.firebaseDatabase.boardGamesLibrary$;
  constructor(private firebaseDatabase: FirebaseDatabaseService, private navigationService: NavigationService) { }
}
