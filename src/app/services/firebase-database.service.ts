import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {map, Observable, take} from 'rxjs';
import {Biblio, Library} from '../models/author.model';
import {BddGame, BoardGame} from '../models/boardGame.model';
import {LudoStatus, Ludotheque} from '../models/common.model';
import {VideoGame} from '../models/videoGames.model';
import {OutsideGame} from '../models/outsideGames.model';
import {Game} from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {

  public bibliotheque$: Observable<Array<Biblio>>;
  public ludotheque$: Observable<Ludotheque>;
  public boardGames$: Observable<Array<BoardGame>>;
  public boardGamesOneShot$: Observable<Array<BoardGame>>;
  public boardGamesLibrary$: Observable<Library>;
  public videoGames$: Observable<Array<VideoGame>>;
  public videoGamesOneShot$: Observable<Array<VideoGame>>;
  public videoGamesLibrary$: Observable<Library>;
  public outsideGames$: Observable<Array<OutsideGame>>;
  public outsideGamesLibrary$: Observable<Library>;

  constructor(private db: AngularFireDatabase) {
    this.ludotheque$ = this.db.object('ludotheque').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Ludotheque));

    this.bibliotheque$ = this.db.object('bibliotheque').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Array<Biblio>));

    this.boardGames$ = this.db.object<BddGame>('ludotheque/boardGames/games')
      .valueChanges().pipe(
        map((boardGamesBdd) => Game.bddGameToLudoGame(boardGamesBdd) as Array<BoardGame>)
      );
    this.boardGamesOneShot$ = this.db.object<BddGame>('ludotheque/boardGames/games')
      .valueChanges().pipe(
        take(1),
        map((boardGamesBdd) => Game.bddGameToLudoGame(boardGamesBdd) as Array<BoardGame>)
      );
    this.boardGamesLibrary$ = this.db.object('ludotheque/boardGames/library').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Library));

    this.videoGames$ =  this.db.object<BddGame>('ludotheque/videoGames/games')
      .valueChanges().pipe(
        map((videoGameBdd) => Game.bddGameToLudoGame(videoGameBdd) as Array<VideoGame>)
      );
    this.videoGamesOneShot$ =  this.db.object<BddGame>('ludotheque/videoGames/games')
      .valueChanges().pipe(
        take(1),
        map((videoGameBdd) => Game.bddGameToLudoGame(videoGameBdd) as Array<VideoGame>)
      );
    this.videoGamesLibrary$ = this.db.object('ludotheque/videoGames/library').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Library));

    this.outsideGames$ = this.db.object<Array<OutsideGame>>('ludotheque/outsideGames/games').valueChanges()
      .pipe(map(res => res as Array<OutsideGame>));
    this.outsideGamesLibrary$ = this.db.object('ludotheque/outsideGames/library').valueChanges()
      .pipe(map(res => res as Library));

  }

  updateBoardGame(boardGame: BoardGame | null, newStatus: LudoStatus, employee: string): void {
    if (boardGame) {
      this.db.object(`ludotheque/boardGames/games/${boardGame.ref}`).update({status: newStatus});
    }
  }
}
