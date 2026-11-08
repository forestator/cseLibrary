import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {BehaviorSubject, map} from 'rxjs';
import {BddUsers, CseUser} from '../../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userList$: BehaviorSubject<Array<CseUser>> = new BehaviorSubject<Array<CseUser>>([]);

  constructor(private db: AngularFireDatabase) {
    this.db.object<BddUsers>('users').valueChanges().pipe(
      map((users) => Object.values(users))).subscribe(
        value => this.userList$.next(value)
    );
  }

  addUser(newUSer: CseUser): void {
    this.db.object(`users/${newUSer.id}`).set(newUSer);
  }
}
