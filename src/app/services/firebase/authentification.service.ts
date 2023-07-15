import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {map, Observable} from 'rxjs';
import firebase from 'firebase/compat';
import User = firebase.User;

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  readonly adminUids = [
    'h0F4SqDlGWXgHAjesEQRzExYN3c2',
    'bcCO7BDwU1hvnDjKMNb2GvRwI1Y2',
    'UCugwOtt4cVGffoIkzoxYJpgQe93'
  ];
  adminBricoUid = 'ls9tc3kKxeRlkaXAccs0qk9T9oA2';
  adminLudoUid = 'TtUtjCQZW8cE51IBltKf1LzjxW42';
  adminNautismeUid = 'x4jVMSuZwKZR8ECj6UsxsMLvVAn1';
  adminSonoUid = 'h1YOMupBxBTdKBAuCGJFryqE4n72';

  currentUser$: Observable<User | null> = this.auth.user;
  isUserSuperAdmin: Observable<boolean> = this.currentUser$.pipe(
    map((user) => {
      return this.adminUids.includes(user?.uid);
    })
  );
  isUserBricolageAdmin$: Observable<boolean> = this.currentUser$.pipe(
    map((user) => {
      return this.adminBricoUid === user?.uid || this.adminUids.includes(user?.uid);
    })
  );
  isUserLudoAdmin$: Observable<boolean> = this.currentUser$.pipe(
    map((user) => {
      return this.adminLudoUid === user?.uid || this.adminUids.includes(user?.uid);
    })
  );
  isUserNautismeAdmin$: Observable<boolean> = this.currentUser$.pipe(
    map((user) => {
      return this.adminNautismeUid === user?.uid || this.adminUids.includes(user?.uid);
    })
  );
  isUserSonoAdmin$: Observable<boolean> = this.currentUser$.pipe(
    map((user) => {
      return this.adminSonoUid === user?.uid || this.adminUids.includes(user?.uid);
    })
  );

  constructor(public auth: AngularFireAuth) {
  }

  logout() {
    return this.auth.signOut();
  }
}
