import {BddMaterielPhoto, MaterielPhotoItem, MaterielPhotoStatus, PhotoCategory} from './materiel-photo.model';

export class PhotoUtils {
  public static BddItemToPhotoItem(photoBddItem: BddMaterielPhoto, category: PhotoCategory): MaterielPhotoItem[] {
    if (photoBddItem) {
      return Object.keys(photoBddItem).map(
        (key) => Object.assign({
          id: key,
          category,
          status: photoBddItem[key]?.status ?? MaterielPhotoStatus.AVAILABLE
        }, photoBddItem[key])
      );
    } else {
      return [];
    }
  }
}
