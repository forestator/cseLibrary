import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {map, Observable} from 'rxjs';
import firebase from 'firebase/compat';
import User = firebase.User;

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  readonly adminUid = [
    'h0F4SqDlGWXgHAjesEQRzExYN3c2',
    'bcCO7BDwU1hvnDjKMNb2GvRwI1Y2',
    'UCugwOtt4cVGffoIkzoxYJpgQe93'
  ];

  currentUser$: Observable<User | null> = this.auth.user;
  userAllowedToWrite$: Observable<boolean> = this.currentUser$.pipe(
    map((user) => {
      console.log(user);
      return this.adminUid.includes(user?.uid);
    })
  );

  constructor(public auth: AngularFireAuth) {
  }

  logout() {
    return this.auth.signOut();
  }
}
