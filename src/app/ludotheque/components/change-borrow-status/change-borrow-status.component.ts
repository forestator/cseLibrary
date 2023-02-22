import {Component, Inject, OnInit} from '@angular/core';
import {BoardGame} from '../../../models/boardGame.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LudoStatus} from '../../../models/common.model';
import {UserService} from '../../../services/firebase/user.service';
import {combineLatest, map, Observable} from 'rxjs';
import {CseUser} from '../../../models/users.model';
import {FormControl} from '@angular/forms';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'app-change-borrow-status',
  templateUrl: './change-borrow-status.component.html',
  styleUrls: ['./change-borrow-status.component.scss']
})
export class ChangeBorrowStatusComponent implements OnInit {
  employeeFomControl: FormControl<string | null> = new FormControl<string>('');
  statusOptions: Array<string>;
  newStatus: LudoStatus;
  filterUserAutocomplete$?: Observable<Array<CseUser>>;
  selectedEmployee?: CseUser;

  constructor(
    public dialogRef: MatDialogRef<ChangeBorrowStatusComponent>,
    public userService: UserService,
    public firebaseDatabaseService: FirebaseDatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: { boardGame: BoardGame },
  ) {
    this.statusOptions = Object.values(LudoStatus);
    this.newStatus = this.data.boardGame.status === LudoStatus.AVAILABLE ?
      LudoStatus.EMPRUNTE : LudoStatus.AVAILABLE;
  }

  ngOnInit() {
    this.filterUserAutocomplete$ =
      combineLatest([this.employeeFomControl.valueChanges, this.userService.userList$]).pipe(
        map(([value, userList]) => this._filter(value || '', userList)),
      );
  }

  cancel(): void {
    this.dialogRef.close();
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
  displayUser(user: CseUser): string {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }
  selectEmployee(option: MatAutocompleteSelectedEvent) {
    this.selectedEmployee = option.option.value;
  }

  borrowGame() {
    this.firebaseDatabaseService.updateBoardGame(this.data.boardGame, this.newStatus, this.selectedEmployee!);
    this.cancel();
  }

  addNewEmployee() {

  }
}
