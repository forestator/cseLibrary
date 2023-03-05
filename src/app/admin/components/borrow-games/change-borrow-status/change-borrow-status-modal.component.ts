import {Component, Inject, OnInit} from '@angular/core';
import {BoardGame} from '../../../../models/boardGame.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Game, LudoStatus} from '../../../../models/common.model';
import {map, Observable} from 'rxjs';
import {BorrowStatus, CseUser} from '../../../../models/users.model';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {FirebaseDatabaseService} from '../../../../services/firebase/firebase-database.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {VideoGame} from '../../../../models/videoGames.model';
import moment, {Moment} from 'moment';
import {DateFilterFn} from '@angular/material/datepicker';

@Component({
  selector: 'app-change-borrow-status',
  templateUrl: './change-borrow-status-modal.component.html',
  styleUrls: ['./change-borrow-status-modal.component.scss']
})
export class ChangeBorrowStatusModalComponent implements OnInit {
  employeeFomControl: FormControl<string | CseUser>;
  statusOptions: Array<string>;
  newStatus: LudoStatus;
  filterUserAutocomplete$?: Observable<Array<CseUser>>;
  selectedEmployee?: CseUser;
  range: FormGroup;
  dateFilter: DateFilterFn<Date>;


  constructor(
    public dialogRef: MatDialogRef<ChangeBorrowStatusModalComponent>,
    public firebaseDatabaseService: FirebaseDatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: {
      users: Array<CseUser>,
      game: BoardGame | VideoGame | Game
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
    this.initDateFormGroup();
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

  private initDateFormGroup(): void {
    this.dateFilter = (d: Date | null): boolean => {
      const day = (moment(d) || moment()).day();
      const week = (moment(d) || moment()).week();
      return (day === 2 || day === 4) && (week % 2 === 0);
    };

    const currentDate: Moment = moment();
    if (currentDate.day() !== 2 || currentDate.day() !== 4) {
      currentDate.day(currentDate.day() === 3 ? 4 : 2);
    }
    if (currentDate.week() % 2 !== 0) {
      currentDate.add(1, 'week');
    }

    const validRange: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const start = control.get('start').value;
      const end = control.get('end').value;
      const duration = moment.duration(moment(end).diff(moment(start)));
      const days = duration.asDays();
      const forbidden = days > 30;
      return forbidden ? {tooLongRange: {value: days}} : null;
    };

    this.range = new FormGroup({
      start: new FormControl<Date | null>(currentDate.toDate()),
      end: new FormControl<Date | null>(currentDate.add(14, 'days').toDate()),
    }, {validators: validRange});
  }
}
