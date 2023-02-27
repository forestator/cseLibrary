import {Pipe, PipeTransform} from '@angular/core';
import {CseUser} from '../../models/users.model';

@Pipe({
  name: 'borrowedByUser'
})
export class BorrowedByUserPipe implements PipeTransform {

  transform(ref: string, userList: Array<CseUser>): string {
    const user = userList.find(user => user.borrowedGames && user.borrowedGames[ref]);
    return user ? `${user.firstName} ${user.lastName}` : '???';
  }

}
