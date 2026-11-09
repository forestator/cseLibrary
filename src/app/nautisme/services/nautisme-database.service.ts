import { Injectable, inject } from '@angular/core';
import {map, Observable, take} from "rxjs";
import {Library} from "../../models/author.model";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {BddNautismeItem, NautismeItem, NautismeStatus} from "../models/nautisme.model";
import {FileUpload} from '../../models/fileUpload.model';

@Injectable({
  providedIn: 'root'
})
export class NautismeDatabaseService {
  private db = inject(AngularFireDatabase);

  nautismeLibrary$: Observable<Library>;
  allNautisme$: Observable<NautismeItem[]>;

  constructor() {
    this.nautismeLibrary$ = this.db.object<Library>('nautisme/library')
      .valueChanges().pipe(take(1));
    this.allNautisme$ = this.db.object<BddNautismeItem>('nautisme/items').valueChanges().pipe(
      take(1),
      map(allNautismeItems => {
        const allItems = Object.keys(allNautismeItems).map(itemId => allNautismeItems[itemId]);
        return allItems.map(item => Object.assign({status: item.status ?? NautismeStatus.AVAILABLE}, item));
      })
    );
  }

  addNautismeItem(item: NautismeItem) {
    return this.db.object(`nautisme/items/${item.id}`).update(item);
  }

  updateItemCover(item: NautismeItem, fileUpload: FileUpload) {
    return this.db.object(`nautisme/items/${item.id}`)
      .update({cover: fileUpload.url});
  }

  delete(item: NautismeItem) {
    return this.db.object(`nautisme/items/${item.id}`).remove();
  }
}
