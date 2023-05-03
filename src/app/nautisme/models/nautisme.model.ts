export enum NautismeStatus {
  AVAILABLE = 'AVAILABLE',
  HS = 'HS'
}

export interface BddNautismeItem {
  [id: string]: NautismeItem;
}

export interface NautismeItem {
  status?: NautismeStatus;
  id: number;
  name: string;
  cover?: string;
  description?: string;
}
