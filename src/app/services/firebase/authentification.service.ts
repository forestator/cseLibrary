import {Injectable, inject} from '@angular/core';
import {Auth, GithubAuthProvider, GoogleAuthProvider, authState, signInWithEmailAndPassword, signInWithPopup, signOut, User} from '@angular/fire/auth';
import {map, Observable} from 'rxjs';

// The same UID lists are mirrored in firestore.rules: keep both in sync.
const SUPER_ADMIN_UIDS: ReadonlyArray<string> = [
  'OBWB7BXsEHPYmauZ6NqwEzcuc0x2',
  'WYf433kVzQUmHHRrEM1Th7eESvH3',
  'h0F4SqDlGWXgHAjesEQRzExYN3c2',
  'bcCO7BDwU1hvnDjKMNb2GvRwI1Y2',
  'UCugwOtt4cVGffoIkzoxYJpgQe93',
  'whXa5tBO1VZQhCWRhO1gYbcJmrH3',
];
const BRICOLAGE_ADMIN_UID = 'ls9tc3kKxeRlkaXAccs0qk9T9oA2';
const LUDO_ADMIN_UID = 'TtUtjCQZW8cE51IBltKf1LzjxW42';
const NAUTISME_ADMIN_UID = 'x4jVMSuZwKZR8ECj6UsxsMLvVAn1';
const SONO_ADMIN_UID = 'h1YOMupBxBTdKBAuCGJFryqE4n72';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private readonly auth = inject(Auth);

  readonly currentUser$: Observable<User | null> = authState(this.auth);
  readonly isUserSuperAdmin: Observable<boolean> = this.isAdminOf();
  readonly isUserBricolageAdmin$: Observable<boolean> = this.isAdminOf(BRICOLAGE_ADMIN_UID);
  readonly isUserLudoAdmin$: Observable<boolean> = this.isAdminOf(LUDO_ADMIN_UID);
  readonly isUserNautismeAdmin$: Observable<boolean> = this.isAdminOf(NAUTISME_ADMIN_UID);
  readonly isUserSonoAdmin$: Observable<boolean> = this.isAdminOf(SONO_ADMIN_UID);

  logout() {
    return signOut(this.auth);
  }

  signInWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  signInWithGithub() {
    return signInWithPopup(this.auth, new GithubAuthProvider());
  }

  signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  private isAdminOf(commissionAdminUid?: string): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user && (SUPER_ADMIN_UIDS.includes(user.uid) || user.uid === commissionAdminUid))
    );
  }
}
