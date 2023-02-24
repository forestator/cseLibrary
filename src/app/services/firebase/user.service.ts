import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {map, Observable} from 'rxjs';
import {BddUsers, CseUser} from '../../models/users.model';
import {BoardGame} from '../../models/boardGame.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userList$: Observable<Array<CseUser>>;

  constructor(private db: AngularFireDatabase) {
    this.userList$ = this.db.object<BddUsers>('users').valueChanges().pipe(
      map((users) => Object.values(users)));
  }

  setBorrowedGameOfUser(employee: CseUser, boardGame: BoardGame): void {
    const borrowedGames = employee?.borrowedGames ? [...employee.borrowedGames, boardGame.ref] : [boardGame.ref];
    this.db.object(`users/${employee.id}`).update({borrowedGames});
  }

  removeBorrowedGameOfUser(employee: CseUser, boardGame: BoardGame): void {
    const borrowedGames = employee!.borrowedGames!.filter(gameRef => gameRef !== boardGame.ref);
    this.db.object(`users/${employee.id}`).update({borrowedGames});
  }

  addUser(newUSer: CseUser): void {
    this.db.object(`users/${newUSer.id}`).set(newUSer);
  }
}
