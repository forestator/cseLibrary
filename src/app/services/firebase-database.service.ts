import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {map, Observable, take} from 'rxjs';
import {Library} from '../models/author.model';
import {BoardGame} from '../models/boardGame.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {

  public ludotheque$: Observable<{ boardGames: any; videoGames: any }>;
  public boardGames$: Observable<Array<BoardGame>>
  public boardGamesLibrary$: Observable<Library>;

  constructor(private db: AngularFireDatabase) {
    this.ludotheque$ = this.db.object('ludotheque').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as { boardGames: any; videoGames: any }));
    this.boardGames$ = this.db.object('ludotheque/boardGames/games').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Array<BoardGame>));
    this.boardGamesLibrary$ = this.db.object('ludotheque/boardGames/library').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Library));
  }
}
