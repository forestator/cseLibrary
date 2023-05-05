export enum MaterielPhotoStatus {
  AVAILABLE = 'AVAILABLE',
  HS = 'HS'
}

export interface BddMaterielPhoto {
  [id: string]: MaterielPhotoItem;
}

export enum PhotoCategory {
  APPAREIL_PHOTO = 'appareilsPhoto',
  ACCESSOIRES = 'accessoires',
  CAMESCOPES = "camescopes",
  VIDEO_PROJECTEUR = 'videoProjecteur',
  DIVERS = 'divers'
}

export interface MaterielPhotoItem {
  status?: MaterielPhotoStatus;
  category: PhotoCategory;
  id: number;
  name: string;
  cover?: string;
  description?: string;
}
