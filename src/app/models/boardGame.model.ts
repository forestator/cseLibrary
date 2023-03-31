import {Game} from './common.model';

export interface Attributes {
  type: string;
  id?: string;
  value?: string;
  numvotes?: string;
  name?: string;
  totalvotes?: string;
}

export interface Thing {
  type: string;
  name: string;
  attributes: Attributes;
  elements: Thing[];
  text?: string;
}

export interface BoardGame extends Game {
  id: string;
  weight: string;
  yearPublished?: number;
  minPlayers?: number;
  maxPlayers?: number;
  playingTime?: number;
  minAge?: number;
  suggestedPlayAge?: number;
  themes?: string[];
}

export enum BoardGameCategory {
  duo = 'duo',
  ambiance = 'ambiance',
  culture = 'culture',
  familial = 'familial',
  strategie = 'strategie',
  puzzle = 'puzzle',
  enfant = 'enfant',
  escape = 'escape',
  abstrait = 'abstrait',
  inclassable = 'inclassable',
  enquete = 'enquete',
  coop = 'coop',
}

export interface AdvancedBoardGameFilter {
  duration?: string;
  age?: string;
  nbPlayers?: string;
}

export enum BoardGameFilterType {
  DURATION = 'duration',
  AGE = 'age',
  NUMBER_OF_PLAYERS = 'nbPlayers'
}
