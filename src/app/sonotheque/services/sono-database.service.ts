import { Injectable, inject } from '@angular/core';
import {map, Observable, take} from "rxjs";
import {Library} from "../../models/author.model";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {FileUpload} from "../../models/fileUpload.model";
import {SonoBddItems, SonoCategories, SonoCategory, SonoItem} from "../models/sono.model";
import {SonoUtils} from "../models/sono.utils";

@Injectable({
  providedIn: 'root'
})
export class SonoDatabaseService {
  private db = inject(AngularFireDatabase);


  sonothequeLibrary$: Observable<Library>;
  allItems$: Observable<SonoItem[]>;

  constructor() {
    this.sonothequeLibrary$ = this.db.object<Library>('sonotheque/library')
      .valueChanges().pipe(take(1));
    this.allItems$ = this.db.object<SonoCategories>('sonotheque/items').valueChanges().pipe(
      map(allSono => {
        const allSonoItems: Array<SonoItem> = [];
        Object.values(SonoCategory)
          .forEach(categoryId => {
            const sonoItemOfCat = allSono[categoryId];
            const sonoItemsOfCategory = SonoUtils.BddItemToSonoItem(sonoItemOfCat, categoryId);
            allSonoItems.push(...sonoItemsOfCategory);
          });
        return allSonoItems;
      })
    );
  }

  getSonoCategory(categoryId: SonoCategory): Observable<SonoItem[]> {
    return this.db.object<SonoBddItems>(`sonotheque/items/${categoryId}`).valueChanges().pipe(
      take(1),
      map((sonoItems) => SonoUtils.BddItemToSonoItem(sonoItems, categoryId) as Array<SonoItem>)
    );
  }

  addSonoItem(item: SonoItem) {
    return this.db.object(`sonotheque/items/${item.category}/${item.id}`).update(item);
  }

  updateItemCover(item: SonoItem, fileUpload: FileUpload) {
    return this.db.object(`sonotheque/items/${item.category}/${item.id}`)
      .update({cover: fileUpload.url});
  }

  async delete(item: SonoItem) {
    return this.db.object(`sonotheque/items/${item.category}/${item.id}`)
      .remove();
  }
}
