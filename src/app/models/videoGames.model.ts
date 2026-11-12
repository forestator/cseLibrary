import {Game} from './common.model';

export enum Consoles {
  switch = 'switch',
  switch2 = 'switch2',
  ps4 = 'ps4',
  ps5 = 'ps5',
  xboxOne = 'xboxOne',
  xboxX = 'xboxX',
  wii = 'wii',
  ps3 = 'ps3',
  xbox360 = 'xbox360',
  ds = 'ds',
  ds3 = 'ds3',
  ps2 = 'ps2',
  psp = 'psp',
  psVita = 'psVita',
}

/** Consoles that are no longer sold: still lent, but shown after the current ones. */
const LEGACY_CONSOLES: ReadonlyArray<string> = [
  Consoles.wii, Consoles.ps3, Consoles.xbox360, Consoles.ds, Consoles.ds3, Consoles.ps2, Consoles.psp, Consoles.psVita,
];

export function isLegacyConsole(console: string): boolean {
  return LEGACY_CONSOLES.includes(console);
}

export interface VideoGame extends Game {
  type?: VideoGameType;
}

export enum VideoGameType {
  CONSOLE = "CONSOLE",
  ACCESSORY = "ACCESSORY",
  GAME = "GAME"
}
