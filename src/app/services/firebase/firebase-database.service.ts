import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {map, Observable, take} from 'rxjs';
import {Biblio, Library} from '../../models/author.model';
import {BoardGame} from '../../models/boardGame.model';
import {BddGame, LudoStatus, Ludotheque} from '../../models/common.model';
import {VideoGame} from '../../models/videoGames.model';
import {OutsideGame} from '../../models/outsideGames.model';
import {GamesUtils} from '../../models/gamesUtils';
import {BorrowStatus, CseUser} from '../../models/users.model';
import {UserService} from './user.service';

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
  public outsideGames$: Observable<Array<OutsideGame> | null>;
  public outsideGamesLibrary$: Observable<Library | null>;

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
        map((outsideGameBdd) => GamesUtils.bddGameToLudoGame(outsideGameBdd) as Array<OutsideGame>)
      );
    this.outsideGamesLibrary$ = this.db.object<Library>('ludotheque/outsideGames/library').valueChanges()
      .pipe(take(1));

  }

  setNewBorrowForUser(game: BoardGame | VideoGame | OutsideGame, employee: CseUser): void {
    this.updateGame(game, LudoStatus.EMPRUNTE);
    this.userService.setBorrowedGameOfUser(employee, game);
  }

  removeBorrowForUser(game: BoardGame | VideoGame | OutsideGame, employee: CseUser): void {
    this.updateGame(game, LudoStatus.AVAILABLE);
    this.userService.removeBorrowedGameOfUser(employee, game.ref);
  }

  private updateGame(game: BoardGame | VideoGame | OutsideGame | BorrowStatus,
                     newStatus: LudoStatus.AVAILABLE | LudoStatus.EMPRUNTE) {
    this.db.object(`ludotheque/${ GamesUtils.libraryIdOfGame(game)}/games/${game.ref}`)
      .update({status: newStatus});
  }
}
