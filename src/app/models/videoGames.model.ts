import {LudoStatus} from './common.model';

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
  status: LudoStatus;
  type?: VideoGameType;
  cover?: string;
  category: Consoles;
}

export enum VideoGameType {
  CONSOLE = "CONSOLE",
  ACCESSORY = "ACCESSORY",
  GAME = "GAME"
}
