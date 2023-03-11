import {Pipe, PipeTransform} from '@angular/core';
import {UserService} from '../../services/firebase/user.service';
import {map, Observable, take} from 'rxjs';

@Pipe({
  name: 'userById'
})
export class UserByIdPipe implements PipeTransform {

  constructor(private userService: UserService) {
  }

  transform(userId: string): Observable<string> {
    return this.userService.userList$.pipe(
      take(1),
      map(users => {
        const foundUser = users.find(user => user.id === userId)!;
        return `${foundUser.firstName} ${foundUser.lastName}`;
      })
    );
  }

}
