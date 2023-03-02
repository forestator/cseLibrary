import {Consoles, VideoGame} from './videoGames.model';
import {BoardGame, BoardGameCategory} from './boardGame.model';
import {Library} from './author.model';

export interface Ludotheque {
  boardGames: LudothequeDetails;
  videoGames: LudothequeDetails;
  outsideGames: LudothequeDetails;
}

export interface LudothequeDetails {
  games: BddGame;
  library: Library;
}

export enum LudoStatus {
  AVAILABLE = 'AVAILABLE',
  EMPRUNTE = 'EMPRUNTE',
  MISSING = 'MISSING',
}

export interface Game {
  ref: string;
  name: string;
  status: LudoStatus;
  isNew?: boolean;
  cover?: string;
  category: BoardGameCategory | Consoles | string;
  description?: string;
}

export interface BddGame {
  [ref: string]: BoardGame | VideoGame | Game;
}
