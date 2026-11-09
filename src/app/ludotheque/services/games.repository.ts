import {Injectable, Injector, inject, runInInjectionContext} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {combineLatest, map, Observable, take} from 'rxjs';
import {Library} from '../../models/author.model';
import {BoardGame} from '../../models/boardGame.model';
import {BddGame, Game, LibraryId} from '../../models/common.model';
import {VideoGame} from '../../models/videoGames.model';
import {GamesUtils} from '../../models/gamesUtils';

export interface GameByLibrary {
  boardGames: BoardGame;
  videoGames: VideoGame;
  outsideGames: Game;
}

export type GameOf<Id extends LibraryId> = GameByLibrary[Id];

const LIBRARY_IDS: ReadonlyArray<LibraryId> = ['boardGames', 'videoGames', 'outsideGames'];

/**
 * Single access point to the ludotheque data. Components only know libraries and games:
 * the storage layout (RTDB paths `ludotheque/{libraryId}/{games/{ref},library}`) stays private,
 * so swapping the backend only means rewriting this class.
 */
@Injectable({providedIn: 'root'})
export class GamesRepository {
  private db = inject(AngularFireDatabase);
  private injector = inject(Injector);

  /** Live list of the games of a library, newest reference first. */
  watchGames$<Id extends LibraryId>(libraryId: Id): Observable<Array<GameOf<Id>>> {
    return this.gamesByRef$(libraryId).pipe(map(gamesByRef => this.toSortedList<Id>(gamesByRef)));
  }

  /** Current games of a library, read once. */
  loadGames$<Id extends LibraryId>(libraryId: Id): Observable<Array<GameOf<Id>>> {
    return this.watchGames$(libraryId).pipe(take(1));
  }

  /** Games of every library, read once. */
  loadAllGames$(): Observable<Array<Game>> {
    return combineLatest(LIBRARY_IDS.map(libraryId => this.loadGames$(libraryId))).pipe(
      map(gamesPerLibrary => gamesPerLibrary.flat())
    );
  }

  loadLibrary$(libraryId: LibraryId): Observable<Library | null> {
    return this.object<Library>(`ludotheque/${libraryId}/library`).valueChanges().pipe(take(1));
  }

  addGame(game: Game, libraryId?: LibraryId): Promise<void> {
    return this.gameObject(game, libraryId).set(game);
  }

  updateGame(game: Game, libraryId?: LibraryId): Promise<void> {
    return this.gameObject(game, libraryId).update(game);
  }

  deleteGame(game: Game): Promise<void> {
    return this.gameObject(game).remove();
  }

  updateCover(game: Game, coverUrl: string): Promise<void> {
    return this.gameObject(game).update({cover: coverUrl});
  }

  /** AngularFire's `object()` injects services: it must also work when called lazily, outside a constructor. */
  private object<T>(path: string) {
    return runInInjectionContext(this.injector, () => this.db.object<T>(path));
  }

  private gamesByRef$<Id extends LibraryId>(libraryId: Id): Observable<Record<string, GameOf<Id>> | null> {
    return this.object<BddGame>(`ludotheque/${libraryId}/games`).valueChanges() as
      Observable<Record<string, GameOf<Id>> | null>;
  }

  private gameObject(game: Game, libraryId?: LibraryId) {
    const resolvedLibraryId = libraryId ?? GamesUtils.libraryIdOfGame(game);
    return this.object<Game>(`ludotheque/${resolvedLibraryId}/games/${game.ref}`);
  }

  private toSortedList<Id extends LibraryId>(gamesByRef: Record<string, GameOf<Id>> | null): Array<GameOf<Id>> {
    if (!gamesByRef) {
      return [];
    }
    return Object.entries(gamesByRef)
      .map(([ref, game]) => ({ref, ...game}))
      .sort((first, second) => this.compareRefs(first.ref, second.ref));
  }

  /** References like "ludo12" are ordered by their number, descending; the ones without number come last. */
  private compareRefs(first: string, second: string): number {
    const firstNumber = this.numericPart(first);
    const secondNumber = this.numericPart(second);
    if (firstNumber !== undefined && secondNumber !== undefined) {
      return secondNumber - firstNumber;
    }
    if (firstNumber !== undefined) {
      return -1;
    }
    if (secondNumber !== undefined) {
      return 1;
    }
    return 0;
  }

  private numericPart(ref: string): number | undefined {
    const numericPart = ref?.match(/\d+/);
    return numericPart ? parseInt(numericPart[0], 10) : undefined;
  }
}
