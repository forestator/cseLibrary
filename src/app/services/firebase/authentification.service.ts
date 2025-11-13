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
        'OBWB7BXsEHPYmauZ6NqwEzcuc0x2',
        'WYf433kVzQUmHHRrEM1Th7eESvH3',
        'h0F4SqDlGWXgHAjesEQRzExYN3c2',
        'bcCO7BDwU1hvnDjKMNb2GvRwI1Y2',
        'UCugwOtt4cVGffoIkzoxYJpgQe93',
        'whXa5tBO1VZQhCWRhO1gYbcJmrH3'
    ];
    adminBricoUid = 'ls9tc3kKxeRlkaXAccs0qk9T9oA2';
    adminLudoUid = 'TtUtjCQZW8cE51IBltKf1LzjxW42';
    adminNautismeUid = 'x4jVMSuZwKZR8ECj6UsxsMLvVAn1';
    adminSonoUid = 'h1YOMupBxBTdKBAuCGJFryqE4n72';

    currentUser$: Observable<User | null> = this.auth.user;
    isUserSuperAdmin: Observable<boolean> = this.currentUser$.pipe(
        map((user) => {
            return this.adminUids.includes(this.getUserId(user));
        })
    );
    isUserBricolageAdmin$: Observable<boolean> = this.currentUser$.pipe(
        map((user) => {
            return this.adminBricoUid === this.getUserId(user) || this.adminUids.includes(this.getUserId(user));
        })
    );
    isUserLudoAdmin$: Observable<boolean> = this.currentUser$.pipe(
        map((user) => {
            return this.adminLudoUid === this.getUserId(user) || this.adminUids.includes(this.getUserId(user));
        })
    );
    isUserNautismeAdmin$: Observable<boolean> = this.currentUser$.pipe(
        map((user) => {
            return this.adminNautismeUid === this.getUserId(user) || this.adminUids.includes(this.getUserId(user));
        })
    );
    isUserSonoAdmin$: Observable<boolean> = this.currentUser$.pipe(
        map((user) => {
            return this.adminSonoUid === this.getUserId(user) || this.adminUids.includes(this.getUserId(user));
        })
    );

    constructor(public auth: AngularFireAuth) {
    }

    logout() {
        return this.auth.signOut();
    }

    getUserId(user: any): string {
        if (user?.uid) {
            return user.uid;
        }
        if (user?.multiFactor?.user?.uid) {
            return user?.multiFactor.user.uid;
        }
        if (user?._deletegate?.uid) {
            return user?._deletegate?.uid;
        }
        return '';
    }
}
