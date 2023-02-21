import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {map, mergeMap, Observable, take} from 'rxjs';
import {Biblio, Library} from '../models/author.model';
import {BoardGame} from '../models/boardGame.model';
import {LudoStatus, Ludotheque} from '../models/common.model';
import {VideoGame} from '../models/videoGames.model';
import {OutsideGame} from '../models/outsideGames.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {

  public bibliotheque$: Observable<Array<Biblio>>;
  public ludotheque$: Observable<Ludotheque>;
  public boardGamesSnapshot$: Observable<Array<BoardGame>>
  public boardGamesNotifyChanges$: Observable<Array<BoardGame>>
  public boardGamesLibrary$: Observable<Library>;
  public videoGames$: Observable<Array<VideoGame>>
  public videoGamesLibrary$: Observable<Library>;
  public outsideGames$: Observable<Array<OutsideGame>>
  public outsideGamesLibrary$: Observable<Library>;

  constructor(private db: AngularFireDatabase) {
    this.ludotheque$ = this.db.object('ludotheque').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Ludotheque));
    this.bibliotheque$ = this.db.object('bibliotheque').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Array<Biblio>));
    this.boardGamesSnapshot$ = this.db.object('ludotheque/boardGames/games').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Array<BoardGame>));
    this.boardGamesLibrary$ = this.db.object('ludotheque/boardGames/library').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Library));
    this.videoGames$ = this.db.object('ludotheque/videoGames/games').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Array<VideoGame>));
    this.videoGamesLibrary$ = this.db.object('ludotheque/videoGames/library').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Library));
    this.outsideGames$ = this.db.object('ludotheque/outsideGames/games').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Array<VideoGame>));
    this.outsideGamesLibrary$ = this.db.object('ludotheque/outsideGames/library').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Library));

    this.boardGamesNotifyChanges$ = this.db.list<BoardGame>('ludotheque/boardGames/games').valueChanges();
  }

  updateBoardGame(boardGame: BoardGame | null, newStatus: LudoStatus, employee: string): void {
    if (boardGame) {
      this.boardGamesNotifyChanges$.pipe(
        take(1),
        map((boardGames) => {
          const boardGameToupdate = boardGames.find(bg => bg.id == boardGame.id && bg.ref === boardGame.ref)!;
          boardGameToupdate.status = newStatus;
          return boardGames;
        }),
        mergeMap((boardGames) => {
          return this.db.list('ludotheque/boardGames').set('games', boardGames);
        })
      ).subscribe();
    }
  }
}
