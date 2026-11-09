import {Consoles, VideoGame} from './videoGames.model';
import {BoardGame, BoardGameCategory} from './boardGame.model';

export type LibraryId = 'boardGames' | 'videoGames' | 'outsideGames';

export enum Comissions {
  BIBLIOTHEQUE = 'bibliotheque',
  LUDOTHEQUE = 'ludotheque',
  BRICOLAGE = 'bricolage',
  SONOTHEQUE = 'sonotheque',
  NAUTISME = 'nautisme',
  PHOTO = 'photo',
}

export interface Game {
  ref: string;
  name: string;
  isNew?: boolean;
  cover?: string;
  category: BoardGameCategory | Consoles | string;
  description?: string;
}

export interface BddGame {
  [ref: string]: BoardGame | VideoGame | Game;
}
