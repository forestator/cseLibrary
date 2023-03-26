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


export class AdvancedFilter {
  constructor() {
    this.categoryFilter = {
      duo: false,
      ambiance: false,
      culture: false,
      familial: false,
      strategie: false,
      puzzle: false,
      enfant: false,
      escape: false,
      abstrait: false,
      inclassable: false,
      enquete: false,
      coop: false
    };
    this.minNumberOfPlayers = {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false
    };
    this.maxNumberOfPlayer = {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false
    };
    this.gameDurationFilter = {
      10: false,
      20: false,
      30: false,
      45: false,
      60: false,
      120: false
    };
    this.ageFilter = {
      2: false,
      4: false,
      7: false,
      10: false,
      12: false,
      16: false
    };
  }

  categoryFilter: CategoryFilter;
  minNumberOfPlayers: NbOfPlayersFilter;
  maxNumberOfPlayer: NbOfPlayersFilter;
  gameDurationFilter: DurationFilter;
  ageFilter: AgeFilter;
}

export interface CategoryFilter {
  duo: boolean;
  ambiance: boolean;
  culture: boolean;
  familial: boolean;
  strategie: boolean;
  puzzle: boolean;
  enfant: boolean;
  escape: boolean;
  abstrait: boolean;
  inclassable: boolean;
  enquete: boolean;
  coop: boolean;
}

export interface AgeFilter {
  2: boolean;
  4: boolean;
  7: boolean;
  10: boolean;
  12: boolean;
  16: boolean;
}

export interface NbOfPlayersFilter {
  1: boolean;
  2: boolean;
  3: boolean;
  4: boolean;
  5: boolean;
  6: boolean;
  7: boolean;
  8: boolean;
}

export interface DurationFilter {
  10: boolean;
  20: boolean;
  30: boolean;
  45: boolean;
  60: boolean;
  120: boolean;
}
