import { Injectable, inject } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {map, Observable, take} from 'rxjs';
import {Biblio, Library} from '../../models/author.model';
import {BoardGame} from '../../models/boardGame.model';
import {BddGame, Game, Ludotheque} from '../../models/common.model';
import {VideoGame} from '../../models/videoGames.model';
import {GamesUtils} from '../../models/gamesUtils';
import {FileUpload} from '../../models/fileUpload.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {
  private db = inject(AngularFireDatabase);


  public bibliothequeOneShot$: Observable<Array<Biblio> | null>;
  public bibliothequeStream$: Observable<Array<Biblio>>;
  public ludotheque$: Observable<Ludotheque | null>;
  public boardGames$: Observable<Array<BoardGame>>;
  public boardGamesOneShot$: Observable<Array<BoardGame> | null>;
  public boardGamesLibrary$: Observable<Library | null>;
  public videoGames$: Observable<Array<VideoGame>>;
  public videoGamesOneShot$: Observable<Array<VideoGame>>;
  public videoGamesLibrary$: Observable<Library | null>;
  public outsideGames$: Observable<Array<Game> | null>;
  public outsideGamesLibrary$: Observable<Library | null>;
  public outsideGamesOneShot$: Observable<Array<Game> | null>;
  public allGames: Observable<Array<Game> | null>;

  constructor() {
    this.ludotheque$ = this.db.object<Ludotheque>('ludotheque').valueChanges()
      .pipe(take(1));

    this.bibliothequeOneShot$ = this.db.object<Array<Biblio>>('bibliotheque').valueChanges()
      .pipe(take(1));
    this.bibliothequeStream$ = this.db.object<Array<Biblio>>('bibliotheque').valueChanges();

    this.boardGames$ = this.db.object<BddGame>('ludotheque/boardGames/games')
      .valueChanges().pipe(
        map((boardGamesBdd) => GamesUtils.bddGameToLudoGame(boardGamesBdd) as Array<BoardGame>)
      );
    this.boardGamesOneShot$ = this.db.object<BddGame>('ludotheque/boardGames/games')
      .valueChanges().pipe(
        take(1),
        map((boardGamesBdd) => GamesUtils.bddGameToLudoGame(boardGamesBdd) as Array<BoardGame>)
      );
    this.boardGamesLibrary$ = this.db.object<Library>('ludotheque/boardGames/library').valueChanges()
      .pipe(take(1));

    this.videoGames$ = this.db.object<BddGame>('ludotheque/videoGames/games')
      .valueChanges().pipe(
        map((videoGameBdd) => GamesUtils.bddGameToLudoGame(videoGameBdd) as Array<VideoGame>)
      );
    this.videoGamesOneShot$ = this.db.object<BddGame>('ludotheque/videoGames/games')
      .valueChanges().pipe(
        take(1),
        map((videoGameBdd) => GamesUtils.bddGameToLudoGame(videoGameBdd) as Array<VideoGame>)
      );
    this.videoGamesLibrary$ = this.db.object<Library>('ludotheque/videoGames/library').valueChanges()
      .pipe(take(1));

    this.outsideGames$ = this.db.object<BddGame>('ludotheque/outsideGames/games')
      .valueChanges().pipe(
        map((outsideGameBdd) => GamesUtils.bddGameToLudoGame(outsideGameBdd) as Array<Game>)
      );
    this.outsideGamesOneShot$ = this.db.object<BddGame>('ludotheque/outsideGames/games')
      .valueChanges().pipe(
        take(1),
        map((outsideGameBdd) => GamesUtils.bddGameToLudoGame(outsideGameBdd) as Array<Game>)
      );
    this.outsideGamesLibrary$ = this.db.object<Library>('ludotheque/outsideGames/library').valueChanges()
      .pipe(take(1));

    this.allGames = this.ludotheque$.pipe(
      map(ludo => Object.keys(ludo).map(category => ludo[category].games))
    );
  }

  public updateGameImage(game: Game, newCover: FileUpload) {
    const libraryIdOfGame = GamesUtils.libraryIdOfGame(game);
    this.db.object(`ludotheque/${libraryIdOfGame}/games/${game.ref}`)
      .update({cover: newCover.url});
  }

  addGame(game: BoardGame | VideoGame | Game, libraryId?: string): Promise<void> {
    if (!libraryId) {
      libraryId = GamesUtils.libraryIdOfGame(game);
    }
    return this.db.object<Game>(`ludotheque/${libraryId}/games/${game.ref}`).set(game);
  }

  updateGame(game: BoardGame | VideoGame | Game, libraryId?: string): Promise<void> {
    if (!libraryId) {
      libraryId = GamesUtils.libraryIdOfGame(game);
    }
    return this.db.object<Game>(`ludotheque/${libraryId}/games/${game.ref}`).update(game);
  }

  deleteGame(game: Game) {
    const libraryId = GamesUtils.libraryIdOfGame(game);
    return this.db.object<Game>(`ludotheque/${libraryId}/games/${game.ref}`).remove();
  }
}
