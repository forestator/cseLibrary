import {Library} from "../../models/author.model";

export interface SonoCategories {
  armoire1: SonoBddItems;
  armoire2: SonoBddItems;
  armoire3: SonoBddItems;
  armoire4: SonoBddItems;
  percolateurs: SonoBddItems;
}

export interface Sonotheque {
  items: SonoCategories;
  library: Library;
}


export enum SonoStatus {
  AVAILABLE = 'AVAILABLE',
  HS = 'HS',
  MISSING = 'MISSING',
}

export enum SonoCategory {
  ARMOIRE1 = 'armoire1',
  ARMOIRE2 = 'armoire2',
  ARMOIRE3 = 'armoire3',
  ARMOIRE4 = 'armoire4',
  PERCO = 'percolateurs',
}

export interface SonoItem {
  id: string;
  name: string;
  status?: SonoStatus;
  isNew?: boolean;
  cover?: string;
  category: SonoCategory;
  description?: string;
}

export interface SonoBddItems {
  [id: string]: SonoItem;
}
