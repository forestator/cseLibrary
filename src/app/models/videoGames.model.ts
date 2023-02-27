import {Game} from './common.model';

export enum Consoles {
  switch = 'switch',
  ps4 = 'ps4',
  ps5 = 'ps5',
  xboxOne = 'xboxOne'
}

export interface VideoGame extends Game {
  type?: VideoGameType;
  cover?: string;
}

export enum VideoGameType {
  CONSOLE = "CONSOLE",
  ACCESSORY = "ACCESSORY",
  GAME = "GAME"
}
