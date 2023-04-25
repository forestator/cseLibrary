import {Injectable} from '@angular/core';
import {Observable, take} from "rxjs";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Borrow, BorrowStatus} from "../models/borrow.model";
import {Book} from "../../models/author.model";
import {Tool} from "../../bricolage/models/bricolage.model";
import {Comissions, Game} from "../../models/common.model";
import {CseUser} from "../../models/users.model";
import moment from "moment/moment";

@Injectable({
  providedIn: 'root'
})
export class BorrowDataService {

  constructor(private db: AngularFireDatabase) {
  }

  borrowForUser(userId: string): Observable<Borrow[]> {
    return this.db.object<Borrow[]>(`borrows/${userId}`).valueChanges();
  }

  setNewBorrow(object: Book | Tool | Game, user: CseUser, comission: Comissions, start: string, end: string) {
    const newBorrow: Borrow = {item: object, comission, startDate: start, endDate: end, status: BorrowStatus.EMPRUNTE}
    this.borrowForUser(user.id).pipe(take(1)).subscribe(userBorrows => {
      if (!userBorrows) {
        this.db.object(`borrows/${user.id}`).set([newBorrow]);
      } else {
        userBorrows.push(newBorrow);
        this.db.object(`borrows/${user.id}`).set(userBorrows);
      }
    });
  }

  setReturnForBorrow(user: CseUser, allBorrowsOfUser: Borrow[], selectedBorrow: Borrow) {
    console.log(allBorrowsOfUser);
    console.log(selectedBorrow);
    const index = allBorrowsOfUser.indexOf(selectedBorrow);
    const endDate: string = moment().locale('fr').format('DD/MM/YYYY');
    console.log(index);
    this.db.object(`borrows/${user.id}/${index}`).update({status: BorrowStatus.RETURNED, endDate });
  }
}
