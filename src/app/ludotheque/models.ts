/** Compact fact displayed as an icon and a short text on a game card. */
export interface GameFact {
  icon: string;
  label: string;
}

/** What a game card shows besides the name: key facts always visible, the rest behind the details toggle. */
export interface GameInfos {
  facts: ReadonlyArray<GameFact>;
  details: ReadonlyArray<string>;
}
