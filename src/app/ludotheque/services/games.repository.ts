import {Injectable, inject} from '@angular/core';
import {Firestore, doc, docData} from '@angular/fire/firestore';
import {combineLatest, map, Observable, take} from 'rxjs';
import {Library} from '../../models/author.model';
import {BoardGame} from '../../models/boardGame.model';
import {Game, LibraryId} from '../../models/common.model';
import {VideoGame} from '../../models/videoGames.model';
import {GamesUtils} from '../../models/gamesUtils';
import {removeAtPath, saveAtPath, updateEntries} from '../../services/firestore/document-paths';
import {compareGameRefs} from '../../models/game-ref';

export interface GameByLibrary {
  boardGames: BoardGame;
  videoGames: VideoGame;
  outsideGames: Game;
}

export type GameOf<Id extends LibraryId> = GameByLibrary[Id];

interface LibraryDocument {
  library?: Library;
  games?: Record<string, Game>;
}

const LIBRARY_IDS: ReadonlyArray<LibraryId> = ['boardGames', 'videoGames', 'outsideGames'];

/**
 * Single access point to the ludotheque data. Components only know libraries and games:
 * the storage layout (Firestore document `ludotheque/{libraryId}` = `{library, games: {[ref]: game}}`, see
 * docs/firestore-model.md) stays private, so swapping the backend only means rewriting this class.
 */
@Injectable({providedIn: 'root'})
export class GamesRepository {
  private readonly firestore = inject(Firestore);

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
    return this.libraryDocument$(libraryId).pipe(
      map(libraryDocument => libraryDocument?.library ?? null),
      take(1)
    );
  }

  /** Writes the game whole; when its reference changed the entry it replaces is removed in the same update. */
  saveGame(game: Game, libraryId: LibraryId, previous?: Game): Promise<void> {
    return saveAtPath(this.libraryReference(game, libraryId), this.gamePath(game), game, previous && this.gamePath(previous));
  }

  /** Sets the status of several games of a library in one write. */
  setStatus(games: ReadonlyArray<Game>, libraryId: LibraryId, status: string): Promise<void> {
    return updateEntries(this.libraryReference(games[0], libraryId), games.map(game => ({path: [...this.gamePath(game), 'status'], value: status})));
  }

  /** Deletes several games of a library in one write. */
  deleteGames(games: ReadonlyArray<Game>, libraryId: LibraryId): Promise<void> {
    return updateEntries(this.libraryReference(games[0], libraryId), games.map(game => ({path: this.gamePath(game), value: undefined})));
  }

  deleteGame(game: Game): Promise<void> {
    return removeAtPath(this.libraryReference(game), this.gamePath(game));
  }

  private libraryDocument$(libraryId: LibraryId): Observable<LibraryDocument | undefined> {
    return docData(doc(this.firestore, 'ludotheque', libraryId)) as Observable<LibraryDocument | undefined>;
  }

  private gamesByRef$<Id extends LibraryId>(libraryId: Id): Observable<Record<string, GameOf<Id>> | null> {
    return this.libraryDocument$(libraryId).pipe(
      map(libraryDocument => (libraryDocument?.games ?? null) as Record<string, GameOf<Id>> | null)
    );
  }

  private libraryReference(game: Game, libraryId?: LibraryId) {
    return doc(this.firestore, 'ludotheque', libraryId ?? GamesUtils.libraryIdOfGame(game));
  }

  private gamePath(game: Game): string[] {
    return ['games', game.ref];
  }

  private toSortedList<Id extends LibraryId>(gamesByRef: Record<string, GameOf<Id>> | null): Array<GameOf<Id>> {
    if (!gamesByRef) {
      return [];
    }
    return Object.entries(gamesByRef)
      .map(([ref, game]) => ({ref, ...game}))
      .sort((first, second) => compareGameRefs(first.ref, second.ref));
  }
}
