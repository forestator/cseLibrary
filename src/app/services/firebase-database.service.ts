import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {map, Observable, take} from 'rxjs';
import {Biblio, Library} from '../models/author.model';
import {BoardGame} from '../models/boardGame.model';
import {Ludotheque} from '../models/common.model';
import {VideoGame} from '../models/videoGames.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {

  public ludotheque$: Observable<Ludotheque>;
  public bibliotheque$: Observable<Array<Biblio>>;
  public boardGames$: Observable<Array<BoardGame>>
  public boardGamesLibrary$: Observable<Library>;
  public videoGames$: Observable<Array<VideoGame>>
  public videoGamesLibrary$: Observable<Library>;

  constructor(private db: AngularFireDatabase) {
    this.ludotheque$ = this.db.object('ludotheque').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Ludotheque));
    this.bibliotheque$ = this.db.object('bibliotheque').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Array<Biblio>));
    this.boardGames$ = this.db.object('ludotheque/boardGames/games').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Array<BoardGame>));
    this.boardGamesLibrary$ = this.db.object('ludotheque/boardGames/library').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Library));
    this.videoGames$ = this.db.object('ludotheque/videoGames/games').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Array<VideoGame>));
    this.videoGamesLibrary$ = this.db.object('ludotheque/videoGames/library').snapshotChanges()
      .pipe(take(1), map(res => res.payload.val() as Library));
  }
}
