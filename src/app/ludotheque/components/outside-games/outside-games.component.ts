import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Library} from '../../../models/author.model';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {OutsideGame} from '../../../models/outsideGames.model';

@Component({
  selector: 'app-outside-games',
  templateUrl: './outside-games.component.html',
  styleUrls: ['./outside-games.component.scss']
})
export class OutsideGamesComponent {
  library$: Observable<Library> = this.firebaseDatabase.outsideGamesLibrary$;
  games$: Observable<Array<OutsideGame>> = this.firebaseDatabase.outsideGames$;
  constructor(private firebaseDatabase: FirebaseDatabaseService) { }
}
