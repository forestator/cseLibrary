import {VideoGame} from './videoGames.model';
import {BoardGame} from './boardGame.model';
import {Library} from './author.model';
import {OutsideGame} from './outsideGames.model';

export interface Ludotheque {
  boardGames: LudothequeDetails;
  videoGames: LudothequeDetails;
}

export interface LudothequeDetails {
  //todo not good
  games: Array<VideoGame | BoardGame>;
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
  category?: string;
}

export interface BddGame {
  [ref: string]: BoardGame | VideoGame | OutsideGame;
}
