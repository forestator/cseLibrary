import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {firstValueFrom} from 'rxjs';
import {CseUser} from '../../../models/users.model';
import {UserService} from '../../../services/firebase/user.service';
import {AddEmployeeDialogComponent, NewEmployee} from '../add-employee-dialog/add-employee-dialog.component';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton],
})
export class AdminMenuComponent {
  private readonly snackBar = inject(MatSnackBar);
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);

  protected async addEmployee() {
    const newEmployee = await firstValueFrom(this.dialog.open(AddEmployeeDialogComponent).afterClosed());
    if (!newEmployee) {
      return;
    }
    const users = this.userService.userList$.value;
    if (users.some(user => this.isSameEmployee(user, newEmployee))) {
      this.snackBar.open('Cet utilisateur existe déjà', 'Ok');
    } else {
      this.userService.addUser({...newEmployee, id: String(users.length + 1)});
    }
  }

  private isSameEmployee(user: CseUser, candidate: NewEmployee): boolean {
    const sameName = user.lastName.toLowerCase() === candidate.lastName.toLowerCase()
      && user.firstName.toLowerCase() === candidate.firstName.toLowerCase();
    return sameName || user.email === candidate.email;
  }
}
