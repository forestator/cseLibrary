import {Component, Inject, OnInit} from '@angular/core';
import {BoardGame} from '../../../../models/boardGame.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Game, LudoStatus} from '../../../../models/common.model';
import {map, Observable} from 'rxjs';
import {CseUser} from '../../../../models/users.model';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {FirebaseDatabaseService} from '../../../../services/firebase/firebase-database.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {VideoGame} from '../../../../models/videoGames.model';
import moment, {Moment} from 'moment';
import {DateFilterFn} from '@angular/material/datepicker';
import {GamesUtils} from '../../../../models/gamesUtils';

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
    this.newStatus = this.data.game.status === LudoStatus.AVAILABLE ?
      LudoStatus.EMPRUNTE : LudoStatus.AVAILABLE;
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
    const gameToUpdate = this.data.game;
    if (gameToUpdate.borrowList) {
      gameToUpdate.borrowList.push({
        userId: this.selectedEmployee.id,
        startDate: moment(this.range.get('start').value).format('DD/MM/YYYY'),
        endDate: moment(this.range.get('end').value).format('DD/MM/YYYY')
      });
    } else {
      gameToUpdate.borrowList = [{
        userId: this.selectedEmployee.id,
        startDate: moment(this.range.get('start').value).format('DD/MM/YYYY'),
        endDate: moment(this.range.get('end').value).format('DD/MM/YYYY')
      }];
    }
    this.firebaseDatabaseService.setNewBorrowForUser(gameToUpdate, this.selectedEmployee);
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
      const past = (moment(d) || moment()).isAfter(moment());
      return (day === 2 || day === 4) && (week % 2 === 0) && past;
    };

    const nextLudothequeOpening: Moment = GamesUtils.getNextLudothequeOpening();
    const validRange: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const start = control.get('start').value;
      const end = control.get('end').value;
      const duration = moment.duration(moment(end).diff(moment(start)));
      const days = duration.asDays();
      const forbidden = days > 30;
      return forbidden ? {tooLongRange: {value: days}} : null;
    };
    const isNotReserved: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      if (this.data.game.borrowList) {
        const reserved = GamesUtils.gameIsReservedOrEmprunte(this.data.game.borrowList, control.value);
        return reserved ? {reserved: {value: {start: reserved.startDate, end: reserved.endDate}}} : null;
      } else {
        return null;
      }
    };

    this.range = new FormGroup({
      start: new FormControl<Date | null>(nextLudothequeOpening.toDate(), isNotReserved),
      end: new FormControl<Date | null>(nextLudothequeOpening.add(14, 'days').toDate(), isNotReserved),
    }, {validators: validRange});

    this.range.updateValueAndValidity();
    console.log(this.range);
  }
}
