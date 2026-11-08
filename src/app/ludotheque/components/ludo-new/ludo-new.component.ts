import {Component, OnInit} from '@angular/core';
import {Game} from '../../../models/common.model';
import {BoardGame} from '../../../models/boardGame.model';
import {VideoGame} from '../../../models/videoGames.model';
import {map, Observable} from 'rxjs';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';

@Component({
    selector: 'app-ludo-new',
    templateUrl: './ludo-new.component.html',
    styleUrls: ['./ludo-new.component.scss'],
    standalone: false
})
export class LudoNewComponent implements OnInit {
  videoGames$: Observable<Array<VideoGame>>;
  boardGames$: Observable<Array<BoardGame>>;
  otherGames$: Observable<Array<Game>>;

  constructor(private firebaseDatabaseService: FirebaseDatabaseService) {
  }

  ngOnInit() {
    this.videoGames$ = this.firebaseDatabaseService.videoGamesOneShot$.pipe(
      map(games => games.filter(game => game.isNew))
    );
    this.boardGames$ = this.firebaseDatabaseService.boardGamesOneShot$.pipe(
      map(games => games.filter(game => game.isNew))
    );
    this.otherGames$ = this.firebaseDatabaseService.outsideGamesOneShot$.pipe(
      map(games => games.filter(game => game.isNew))
    );
  }

  exportNewsAsPDF() {

  }
}
