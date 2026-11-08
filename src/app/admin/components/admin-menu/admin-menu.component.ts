import {Component} from '@angular/core';
import {AddEmployeeDialogComponent} from '../add-employee-dialog/add-employee-dialog.component';
import {combineLatest, take} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {UserService} from '../../../services/firebase/user.service';

@Component({
    selector: 'app-admin-menu',
    templateUrl: './admin-menu.component.html',
    styleUrls: ['./admin-menu.component.scss'],
    standalone: false
})
export class AdminMenuComponent {

  constructor(private snackBar: MatSnackBar,
              private userService: UserService,
              private dialog: MatDialog) {
  }

  addEmployee(): void {
    const dialogRef = this.dialog.open(AddEmployeeDialogComponent);

    combineLatest([this.userService.userList$, dialogRef.afterClosed()]).pipe(take(1))
      .subscribe(([users, newUSer]) => {
        if (newUSer) {
          const userAlreadyExist = users.some(user =>
            (user.lastName.toLowerCase() && user.firstName.toLowerCase()) ===
            (newUSer.lastName.toLowerCase() && newUSer.firstName.toLowerCase()) ||
            (user.email === newUSer.email)
          );
          if (!userAlreadyExist) {
            newUSer.id = users.length + 1;
            this.userService.addUser(newUSer);
          } else {
            this.snackBar.open('Cet utilisateur existe déjà', 'Ok');
          }
        }
      });
  };
}
