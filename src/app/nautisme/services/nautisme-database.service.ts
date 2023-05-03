import {Injectable} from '@angular/core';
import {map, Observable, take} from "rxjs";
import {Library} from "../../models/author.model";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {BddNautismeItem, NautismeItem, NautismeStatus} from "../models/nautisme.model";

@Injectable({
  providedIn: 'root'
})
export class NautismeDatabaseService {
  nautismeLibrary$: Observable<Library>;
  allNautisme$: Observable<NautismeItem[]>;

  constructor(private db: AngularFireDatabase) {
    this.nautismeLibrary$ = this.db.object<Library>('nautisme/library')
      .valueChanges().pipe(take(1));
    this.allNautisme$ = this.db.object<BddNautismeItem>('nautisme/items').valueChanges().pipe(
      map(allNautismeItems => {
        const allItems = Object.keys(allNautismeItems).map(itemId => allNautismeItems[itemId]);
        return allItems.map(item => Object.assign({status: item.status ?? NautismeStatus.AVAILABLE}, item));
      })
    )
  }
}
