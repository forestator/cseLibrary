export interface DetailFact {
  icon: string;
  label: string;
}

export interface DetailProperty {
  label: string;
  value: string;
}

/** Everything the side panel needs to describe one item, whatever commission it comes from. */
export interface DetailPanelData {
  title: string;
  cover?: string;
  coverAlt: string;
  tag?: string;
  facts: ReadonlyArray<DetailFact>;
  lines: ReadonlyArray<string>;
  properties: ReadonlyArray<DetailProperty>;
  /** Description kept as the HTML the game library has always stored. */
  descriptionHtml?: string;
  descriptionText?: string;
}
