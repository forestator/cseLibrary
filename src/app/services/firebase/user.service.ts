import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {map, Observable} from 'rxjs';
import {BddUsers, CseUser} from '../../models/users.model';
import moment from 'moment';
import {Game} from '../../models/common.model';
import {GamesUtils} from '../../models/gamesUtils';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userList$: Observable<Array<CseUser>>;

  constructor(private db: AngularFireDatabase) {
    this.userList$ = this.db.object<BddUsers>('users').valueChanges().pipe(
      map((users) => Object.values(users)));
  }

  setBorrowedGameOfUser(employee: CseUser, game: Game): void {
    this.db.object(`users/${employee.id}/borrowedGames/${game.ref}`).set({
      ref: game.ref,
      name: game.name,
      date: moment().locale('fr').format('L'),
      libraryId: GamesUtils.libraryIdOfGame(game)
    });
  }

  removeBorrowedGameOfUser(employee: CseUser, ref: string): void {
    this.db.object(`users/${employee.id}/borrowedGames/${ref}`).remove();
  }

  addUser(newUSer: CseUser): void {
    this.db.object(`users/${newUSer.id}`).set(newUSer);
  }
}
