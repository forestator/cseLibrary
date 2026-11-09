export interface ItemDimensions {
  longueur?: string;
  largeur?: string;
  hauteur?: string;
  PTAC?: string;
  PV?: string;
  volume?: string;
}

export interface CatalogueItem {
  id: string;
  name: string;
  status?: string;
  cover?: string;
  // null is meaningful for the Realtime Database: it deletes the field on update.
  description?: string | null;
  categoryId?: string;
  dimensions?: ItemDimensions;
}

/** Items keyed by their storage key (`id`, or `categoryId/id` when spanning several categories). */
export type ItemCollection = Record<string, CatalogueItem>;
