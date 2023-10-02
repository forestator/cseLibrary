import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Comissions, Game} from '../../../../models/common.model';
import {CseUser} from '../../../../models/users.model';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import moment, {Moment} from 'moment';
import {DateFilterFn} from '@angular/material/datepicker';
import {GamesUtils} from '../../../../models/gamesUtils';
import {Tool} from "../../../../bricolage/models/bricolage.model";
import {Book} from "../../../../models/author.model";
import {BorrowDataService} from "../../../services/borrow-data.service";
import {BricoUtils} from "../../../../bricolage/models/brico-utils";
import {map, Observable} from 'rxjs';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {BorrowStatus} from '../../../models/borrow.model';

interface RangeForm {
  start: FormControl<Date>;
  end: FormControl<Date>;
}

@Component({
  selector: 'app-change-borrow-status',
  templateUrl: './change-borrow-status-modal.component.html',
  styleUrls: ['./change-borrow-status-modal.component.scss']
})
export class ChangeBorrowStatusModalComponent {

  range: FormGroup<RangeForm>;
  employeeSearch: FormControl<string> = new FormControl<string>('');
  filteredOptionsUser$?: Observable<Array<CseUser>>;
  dateFilter: DateFilterFn<Date>;
  selectedUSer?: CseUser;

  constructor(
    public dialogRef: MatDialogRef<ChangeBorrowStatusModalComponent>,
    public borrowDataService: BorrowDataService,
    @Inject(MAT_DIALOG_DATA) public data: {
      user?: CseUser,
      users?: CseUser[],
      comission: Comissions,
      object: Book | Tool | Game
    },
  ) {
    this.initDateFormGroup();

    this.filteredOptionsUser$ = this.employeeSearch.valueChanges.pipe(
      map((value) => this._filterUser(value || '', this.data.users)),
    );
  }

  private _filterUser(value: string | CseUser, userList: Array<CseUser>): Array<CseUser> {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.firstName.toLowerCase();
    return userList.filter((item) => {
      const matchFirstName: boolean = item.firstName.toLowerCase().includes(filterValue);
      const matchLastName: boolean = item.firstName.toLowerCase().includes(filterValue);
      return matchFirstName || matchLastName;
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  borrowGame() {
    this.borrowDataService.setBorrow(
      this.data.object,
      this.data.user ?? this.selectedUSer,
      this.data.comission,
      this.data.user ? BorrowStatus.EMPRUNTE : BorrowStatus.RESERVED,
      moment(this.range.get('start').value).locale('fr').format('L'),
      moment(this.range.get('end').value).locale('fr').format('L'));
    this.cancel();
  }

  private initDateFormGroup(): void {
    this.dateFilter = this.getComissionDates(this.data.comission);
    const nextLudothequeOpening: Moment = this.nextComissionOpening(this.data.comission);

    const validRange: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const start = control.get('start').value;
      const end = control.get('end').value;
      const duration = moment.duration(moment(end).diff(moment(start)));
      const days = duration.asDays();
      const forbidden = days > 30;
      return forbidden ? {tooLongRange: {value: days}} : null;
    };

    this.range = new FormGroup({
      start: new FormControl<Date>(nextLudothequeOpening.toDate()),
      end: new FormControl<Date>(nextLudothequeOpening.add(14, 'days').toDate()),
    }, {validators: validRange});

    this.range.updateValueAndValidity();
  }

  private nextComissionOpening(comission: Comissions) {
    let nextOpenComission: Moment;
    switch (comission) {
      case Comissions.LUDOTHEQUE:
        nextOpenComission = GamesUtils.getNextLudothequeOpening();
        break
      // todo
      case Comissions.BIBLIOTHEQUE:
        break;
      // todo
      case Comissions.SONOTHEQUE:
        break;
      case Comissions.BRICOLAGE:
        nextOpenComission = BricoUtils.nextComissionBricolage();
        break;
      default:
        nextOpenComission = moment();
    }
    return nextOpenComission;
  }

  private getComissionDates(comission: Comissions): (date: Date | null) => boolean {
    switch (comission) {
      case Comissions.LUDOTHEQUE:
        return (d: Date | null): boolean => {
          const day = (moment(d) || moment()).day();
          const week = (moment(d) || moment()).week();
          const past = (moment(d) || moment()).isAfter(moment());
          return (day === 2 || day === 4) && (week % 2 === 0) && past;
        };
      // todo
      case Comissions.BIBLIOTHEQUE:
        return null;
      // todo
      case Comissions.NAUTISME:
        return null;
      // todo
      case Comissions.PHOTO:
        return null;
      // todo
      case Comissions.SONOTHEQUE:
        return null;
      case Comissions.BRICOLAGE:
        return (d: Date | null): boolean => {
          const day = (moment(d) || moment()).day();
          const past = (moment(d) || moment()).isAfter(moment());
          return day === 1 && past;
        };
    }
  }

  displayUser(user: CseUser): string {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  selectUser($event: MatAutocompleteSelectedEvent) {
    this.selectedUSer = $event.option.value;
  }
}
