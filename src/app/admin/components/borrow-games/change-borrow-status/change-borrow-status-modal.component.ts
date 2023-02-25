import {Component, Inject, OnInit} from '@angular/core';
import {BoardGame} from '../../../../models/boardGame.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LudoStatus} from '../../../../models/common.model';
import {UserService} from '../../../../services/firebase/user.service';
import {map, Observable} from 'rxjs';
import {BorrowStatus, CseUser} from '../../../../models/users.model';
import {FormControl} from '@angular/forms';
import {FirebaseDatabaseService} from '../../../../services/firebase/firebase-database.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {VideoGame} from '../../../../models/videoGames.model';
import {OutsideGame} from '../../../../models/outsideGames.model';

@Component({
  selector: 'app-change-borrow-status',
  templateUrl: './change-borrow-status-modal.component.html',
  styleUrls: ['./change-borrow-status-modal.component.scss']
})
export class ChangeBorrowStatusModalComponent implements OnInit {
  employeeFomControl: FormControl<string | CseUser>;
  statusOptions: Array<string>;
  newStatus: LudoStatus.EMPRUNTE | LudoStatus.AVAILABLE;
  filterUserAutocomplete$?: Observable<Array<CseUser>>;
  selectedEmployee?: CseUser;

  constructor(
    public dialogRef: MatDialogRef<ChangeBorrowStatusModalComponent>,
    public userService: UserService,
    public firebaseDatabaseService: FirebaseDatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: {
      users: Array<CseUser>,
      game: BoardGame | VideoGame | OutsideGame
      returnForUser?: CseUser
    },
  ) {
    this.statusOptions = [LudoStatus.EMPRUNTE, LudoStatus.AVAILABLE];
    if (this.data.game instanceof BorrowStatus) {
      this.newStatus = LudoStatus.AVAILABLE;
    } else {
      this.newStatus = this.data.game.status === LudoStatus.AVAILABLE ?
        LudoStatus.EMPRUNTE : LudoStatus.AVAILABLE;
    }
    this.employeeFomControl = new FormControl<string | CseUser>(this.data.returnForUser ?? '');
    this.selectedEmployee = this.data.returnForUser;
  }

  ngOnInit() {
    this.filterUserAutocomplete$ = this.employeeFomControl.valueChanges.pipe(
      map((value) => this._filter(value || '', this.data.users)),
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }

  displayUser(user: CseUser): string {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  selectEmployee(option: MatAutocompleteSelectedEvent) {
    this.selectedEmployee = option.option.value;
  }

  borrowGame() {
    if (this.newStatus === LudoStatus.EMPRUNTE) {
      this.firebaseDatabaseService.setNewBorrowForUser(this.data.game, this.selectedEmployee);
    } else {
      this.firebaseDatabaseService.removeBorrowForUser(this.data.game, this.selectedEmployee);
    }
    this.cancel();
  }

  private _filter(value: string | CseUser, userList: Array<CseUser> | null): Array<CseUser> {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.firstName.toLowerCase();
    if (userList) {
      return userList.filter((item) => {
          const matchFirstName: boolean = item.firstName.toLowerCase().includes(filterValue);
          const matchLastName: boolean = item.firstName.toLowerCase().includes(filterValue);
          return matchFirstName || matchLastName;
        }
      );
    } else {
      return [];
    }
  }
}
