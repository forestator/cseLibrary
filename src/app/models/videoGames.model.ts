export interface VideoGames {
  name: string;
  ref: string;
}

export interface VideoGamesLibs {
  switch: Array<VideoGames>;
  ps4: Array<VideoGames>;
  ps5: Array<VideoGames>;
}
