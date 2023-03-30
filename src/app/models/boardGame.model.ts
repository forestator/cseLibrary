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
    this.numberOfPlayers = {
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
  numberOfPlayers: NbOfPlayersFilter;
  gameDurationFilter: DurationFilter;
  ageFilter: AgeFilter;

  getFilters(): { [key: string]: boolean } {
    let filter: { [key: string]: boolean } = {};
    if (this.ageFilter['2']) Object.assign(filter, {age2: true});
    if (this.ageFilter['4']) Object.assign(filter, {age4: true});
    if (this.ageFilter['7']) Object.assign(filter, {age7: true});
    if (this.ageFilter['10']) Object.assign(filter, {age10: true});
    if (this.ageFilter['12']) Object.assign(filter, {age12: true});
    if (this.ageFilter['16']) Object.assign(filter, {age16: true});
    if (this.numberOfPlayers['1']) Object.assign(filter, {players1: true});
    if (this.numberOfPlayers['2']) Object.assign(filter, {players2: true});
    if (this.numberOfPlayers['3']) Object.assign(filter, {players3: true});
    if (this.numberOfPlayers['4']) Object.assign(filter, {players4: true});
    if (this.numberOfPlayers['5']) Object.assign(filter, {players5: true});
    if (this.numberOfPlayers['6']) Object.assign(filter, {players6: true});
    if (this.numberOfPlayers['7']) Object.assign(filter, {players7: true});
    if (this.numberOfPlayers['8']) Object.assign(filter, {players8: true});
    if (this.gameDurationFilter['10']) Object.assign(filter, {duration10: true});
    if (this.gameDurationFilter['20']) Object.assign(filter, {duration20: true});
    if (this.gameDurationFilter['30']) Object.assign(filter, {duration30: true});
    if (this.gameDurationFilter['45']) Object.assign(filter, {duration45: true});
    if (this.gameDurationFilter['60']) Object.assign(filter, {duration60: true});
    if (this.gameDurationFilter['120']) Object.assign(filter, {duration120: true});
    return filter;
  }
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
