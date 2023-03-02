import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {map, Observable, take} from 'rxjs';
import {Biblio, Library} from '../../models/author.model';
import {BoardGame} from '../../models/boardGame.model';
import {BddGame, Game, LudoStatus, Ludotheque} from '../../models/common.model';
import {VideoGame} from '../../models/videoGames.model';
import {GamesUtils} from '../../models/gamesUtils';
import {BorrowStatus, CseUser} from '../../models/users.model';
import {UserService} from './user.service';
import {FileUpload} from '../../models/fileUpload.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {

  public bibliotheque$: Observable<Array<Biblio> | null>;
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

  constructor(private db: AngularFireDatabase, private userService: UserService) {
    this.ludotheque$ = this.db.object<Ludotheque>('ludotheque').valueChanges()
      .pipe(take(1));

    this.bibliotheque$ = this.db.object<Array<Biblio>>('bibliotheque').valueChanges()
      .pipe(take(1));

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

  }

  setNewBorrowForUser(game: BoardGame | VideoGame | Game, employee: CseUser): void {
    this.updateGameStatus(game, LudoStatus.EMPRUNTE);
    this.userService.setBorrowedGameOfUser(employee, game);
  }

  removeBorrowForUser(game: BoardGame | VideoGame | Game, employee: CseUser): void {
    this.updateGameStatus(game, LudoStatus.AVAILABLE);
    this.userService.removeBorrowedGameOfUser(employee, game.ref);
  }

  private updateGameStatus(game: BoardGame | VideoGame | Game | BorrowStatus,
                           newStatus: LudoStatus.AVAILABLE | LudoStatus.EMPRUNTE) {
    this.db.object(`ludotheque/${GamesUtils.libraryIdOfGame(game)}/games/${game.ref}`)
      .update({status: newStatus});
  }

  public updateGameImage(game: BoardGame | VideoGame | Game,
                         newCover: FileUpload) {
    const libraryIdOfGame = GamesUtils.libraryIdOfGame(game);
    let update;
    switch (libraryIdOfGame) {
      case 'boardGames':
        update = {thumbnail: newCover.url};
        break;
      case 'videoGames':
      case 'outsideGames':
        update = {cover: newCover.url};
        break;
    }
    this.db.object(`ludotheque/${libraryIdOfGame}/games/${game.ref}`)
      .update(update);
  }

  addGame(game: BoardGame | VideoGame | Game, libraryId: string): Promise<void> {
    return this.db.object<Game>(`ludotheque/${libraryId}/games/${game.ref}`).set(game);
  }

  updateGame(game: BoardGame | VideoGame | Game, libraryId: string): Promise<void> {
    return this.db.object<Game>(`ludotheque/${libraryId}/games/${game.ref}`).update(game);
  }
}
