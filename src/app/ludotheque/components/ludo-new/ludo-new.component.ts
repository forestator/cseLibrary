import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import {Game} from '../../../models/common.model';
import {BoardGame} from '../../../models/boardGame.model';
import {VideoGame} from '../../../models/videoGames.model';
import {map, Observable} from 'rxjs';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import { BoardGameCategoryDetailsComponent } from '../board-games/components/board-game-category-details/board-game-category-details.component';
import { VideoGamesConsoleDetailsComponent } from '../video-games/video-games-console-details/video-games-console-details.component';
import { GameRowComponent } from '../outside-games/game-row/game-row.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-ludo-new',
    templateUrl: './ludo-new.component.html',
    styleUrls: ['./ludo-new.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [BoardGameCategoryDetailsComponent, VideoGamesConsoleDetailsComponent, GameRowComponent, AsyncPipe]
})
export class LudoNewComponent implements OnInit {
  private firebaseDatabaseService = inject(FirebaseDatabaseService);

  videoGames$: Observable<Array<VideoGame>>;
  boardGames$: Observable<Array<BoardGame>>;
  otherGames$: Observable<Array<Game>>;

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
