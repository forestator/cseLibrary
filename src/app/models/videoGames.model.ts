import {BoardGameStatus} from './boardGame.model';

export enum Consoles {
  switch = 'switch',
  ps4 = 'ps4',
  ps5 = 'ps5',
  xboxOne = 'xboxOne'
}

export interface VideoGame {
  description?: string;
  name: string;
  ref: string;
  // todo enum
  status: BoardGameStatus;
  type?: VideoGameType;
  cover?: string;
}

export enum VideoGameType {
  CONSOLE = "CONSOLE",
  ACCESSORY = "ACCESSORY",
  GAME = "GAME"
}

export interface VideoGamesLibs {
  switch: Array<VideoGame>;
  ps4: Array<VideoGame>;
  ps5: Array<VideoGame>;
  xboxOne: Array<VideoGame>;
}
