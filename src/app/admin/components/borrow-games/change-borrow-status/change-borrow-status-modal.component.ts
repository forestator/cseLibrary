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
  employeeFomControl: FormControl<string | null> = new FormControl<string>('');
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
      game: BoardGame | VideoGame | OutsideGame | BorrowStatus
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
    this.firebaseDatabaseService.updateBoardGame(this.data.game, this.newStatus, this.selectedEmployee!);
    this.cancel();
  }
}
