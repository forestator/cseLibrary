import {Game} from './common.model';

export enum Consoles {
  switch = 'switch',
  switch2 = 'switch2',
  ps4 = 'ps4',
  ps5 = 'ps5',
  xboxOne = 'xboxOne',
  xboxX = 'xboxX',
}

export interface VideoGame extends Game {
  type?: VideoGameType;
}

export enum VideoGameType {
  CONSOLE = "CONSOLE",
  ACCESSORY = "ACCESSORY",
  GAME = "GAME"
}
