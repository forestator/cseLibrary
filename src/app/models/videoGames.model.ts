import {BoardGameStatus} from './boardGame.model';

export interface VideoGame {
  name: string;
  ref: string;
  // todo enum
  status: BoardGameStatus;
  cover?: string;
}

export interface VideoGamesLibs {
  switch: Array<VideoGame>;
  ps4: Array<VideoGame>;
  ps5: Array<VideoGame>;
}
