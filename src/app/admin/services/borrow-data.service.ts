import {Injectable} from '@angular/core';
import {map, Observable, take} from "rxjs";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Borrow, BorrowByComission, BorrowForUser, BorrowStatus} from "../models/borrow.model";
import {Book} from "../../models/author.model";
import {Tool} from "../../bricolage/models/bricolage.model";
import {Comissions, Game} from "../../models/common.model";
import {CseUser} from "../../models/users.model";
import moment from "moment/moment";
import {SonoItem} from '../../sonotheque/models/sono.model';
import {NautismeItem} from '../../nautisme/models/nautisme.model';

@Injectable({
  providedIn: 'root'
})
export class BorrowDataService {

  allBorrows$: Observable<BorrowForUser>;

  constructor(private db: AngularFireDatabase) {
    this.allBorrows$ = this.db.object<BorrowForUser>('borrows').valueChanges();
    this.setLateStatus();
  }

  borrowForUser(userId: string): Observable<Borrow[]> {
    return this.db.object<Borrow[]>(`borrows/${userId}`).valueChanges();
  }

  setBorrow(object: Book | Tool | Game | SonoItem | NautismeItem, user: CseUser, comission: Comissions, status: BorrowStatus, start: string, end: string) {
    const newBorrow: Borrow = {item: object, comission, startDate: start, endDate: end, status};
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
    const index = allBorrowsOfUser.indexOf(selectedBorrow);
    const endDate: string = moment().locale('fr').format('DD/MM/YYYY');
    this.db.object(`borrows/${user.id}/${index}`).update({status: BorrowStatus.RETURNED, endDate});
  }

  getBorrowsOfComission(comission: Comissions): Observable<BorrowByComission[]> {
    return this.allBorrows$.pipe(
      map(borrowForUsers => {
        return Object.keys(borrowForUsers)
          .map(userId => borrowForUsers[userId].map(borrow => ({userId, ...borrow})))
          .flat()
          .filter(borrowByComission => borrowByComission.comission === comission)
      })
    )
  }

  private setLateStatus() {
    this.db.object<BorrowForUser>('borrows').valueChanges().pipe(
      take(1),
    ).subscribe(borrows => {
      Object.keys(borrows).forEach(userId => {
        borrows[userId].forEach(borrow => {
          if (borrow.status === BorrowStatus.EMPRUNTE &&
            moment(borrow.endDate, 'DD/MM/YYYY').isBefore(moment(new Date(), 'DD/MM/YYYY'))) {
            this.db.object(`borrows/${userId}/${borrows[userId].indexOf(borrow)}`).update({status: BorrowStatus.LATE});
          }
        });
      });
    });
  }
}
