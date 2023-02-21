import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {map, Observable} from 'rxjs';
import firebase from 'firebase/compat';
import User = firebase.User;

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  currentUser$: Observable<User | null> = this.auth.user;
  userAllowedToWrite$: Observable<boolean> = this.currentUser$.pipe(
    map((user) => user?.uid === 'h0F4SqDlGWXgHAjesEQRzExYN3c2')
  );

  constructor(public auth: AngularFireAuth) {
  }
}
