import {VideoGame} from './videoGames.model';
import {BoardGame} from './boardGame.model';
import {Library} from './author.model';

export interface Ludotheque {
  boardGames: LudothequeDetails;
  videoGames: LudothequeDetails;
}

export interface LudothequeDetails {
  games: Array<VideoGame | BoardGame>;
  library: Library;
}

export enum LudoStatus {
  AVAILABLE = 'AVAILABLE',
  EMPRUNTE = 'EMPRUNTE',
  MISSING = 'MISSING',
}
