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

    // const users = {
    //   '1': {firstName: 'Maximilien', lastName: 'Forêt', email: 'maximilien.foret@harmonicinc.com'},
    //   '2': {firstName: 'Fabrice', lastName: 'Templon', email: 'fabrice.templon@harmonicinc.com'},
    //   '3': {firstName: 'Thibault', lastName: 'Riou', email: 'thibault.riou@harmonicinc.com'},
    //   '4': {firstName: 'Veronique', lastName: 'EsnaultLunel', email: 'veronique.esnaultlunel@harmonicinc.com'},
    // };
    //
    // this.db.object('users').set(users);

    this.userList$ = this.db.object<BddUsers>('users').valueChanges().pipe(
      map((users) => {
        if (users) {
          return Object.keys(users).map(
            (key) => Object.assign({id: key}, users[key])
          );
        } else {
          return [];
        }
      })
    );
  }

  setBorrowedGameOfUser(employee: CseUser, boardGame: BoardGame): void {
    const borrowedGames = employee?.borrowedGames ? [...employee.borrowedGames, boardGame.ref] : [boardGame.ref];
    this.db.object(`users/${employee.id}`).update({borrowedGames});
  }

  removeBorrowedGameOfUser(employee: CseUser, boardGame: BoardGame): void {
    const borrowedGames = employee!.borrowedGames!.filter(gameRef => gameRef !== boardGame.ref);
    this.db.object(`users/${employee.id}`).update({borrowedGames});
  }
}
