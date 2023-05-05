import {Injectable} from '@angular/core';
import {map, Observable, take} from "rxjs";
import {Library} from "../../models/author.model";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {BddMaterielPhoto, MaterielPhotoItem, PhotoCategory} from '../models/materiel-photo.model';
import {PhotoUtils} from '../models/photo.utils';

@Injectable({
  providedIn: 'root'
})
export class MaterielPhotoDatabaseService {
  photoLibrary$: Observable<Library>;
  allMaterielPhotoItems$: Observable<MaterielPhotoItem[]>;

  constructor(private db: AngularFireDatabase) {
    this.photoLibrary$ = this.db.object<Library>('photo/library')
      .valueChanges().pipe(take(1));
    this.allMaterielPhotoItems$ = this.db.object<PhotoCategory>('photo/items').valueChanges().pipe(
      map(allPhotoItems => {
        const allMaterielPhotoItems: Array<MaterielPhotoItem> = [];
        Object.values(PhotoCategory)
          .forEach(categoryId => {
            const photoItemOfCat = allPhotoItems[categoryId];
            const photoItemsOfCategory = PhotoUtils.BddItemToPhotoItem(photoItemOfCat, categoryId);
            allMaterielPhotoItems.push(...photoItemsOfCategory);
          });
        return allMaterielPhotoItems;
      })
    )
  }

  getPhotoCategory(categoryId: PhotoCategory): Observable<MaterielPhotoItem[]> {
    return this.db.object<BddMaterielPhoto>(`photo/items/${categoryId}`).valueChanges().pipe(
      take(1),
      map((photoItems) => PhotoUtils.BddItemToPhotoItem(photoItems, categoryId) as Array<MaterielPhotoItem>)
    );
  }
}
