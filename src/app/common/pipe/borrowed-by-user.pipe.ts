import {Pipe, PipeTransform} from '@angular/core';
import {map, Observable} from 'rxjs';
import {BorrowInfo, Game} from '../../models/common.model';
import {UserService} from '../../services/firebase/user.service';
import {CseUser} from '../../models/users.model';

@Pipe({
  name: 'borrowedByUser'
})
export class BorrowedByUserPipe implements PipeTransform {

  constructor(private userService: UserService) {
  }

  transform(game: Game): Observable<string> {
    return this.userService.userList$.pipe(map(users => {
      const lastBorrow: BorrowInfo = game.borrowList[game.borrowList.length - 1];
      const findUser: CseUser = users.find(user => user.id === lastBorrow.userId);
      return `${findUser.firstName} ${findUser.lastName}`;
    }));
  }

}
