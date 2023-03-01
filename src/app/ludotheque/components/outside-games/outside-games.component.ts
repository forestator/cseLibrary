import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Library} from '../../../models/author.model';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {Game} from '../../../models/common.model';

@Component({
  selector: 'app-outside-games',
  templateUrl: './outside-games.component.html',
  styleUrls: ['./outside-games.component.scss']
})
export class OutsideGamesComponent {
  library$: Observable<Library | null> = this.firebaseDatabase.outsideGamesLibrary$;
  games$: Observable<Array<Game> | null> = this.firebaseDatabase.outsideGames$;
  constructor(private firebaseDatabase: FirebaseDatabaseService) { }
}
