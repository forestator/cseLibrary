import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {Library} from '../../../models/author.model';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {Game} from '../../../models/common.model';

@Component({
  selector: 'app-games-list',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  library$: Observable<Library | null> = this.firebaseDatabase.outsideGamesLibrary$;
  @Input() games$: Observable<Array<Game> | null> = this.firebaseDatabase.outsideGames$;
  constructor(private firebaseDatabase: FirebaseDatabaseService) { }
}
