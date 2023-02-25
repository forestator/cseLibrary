import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {MatSort} from '@angular/material/sort';
import {map, Observable, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {BorrowStatus, CseUser} from '../../../models/users.model';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../../services/firebase/user.service';

@Component({
  selector: 'app-borrow-games',
  templateUrl: './borrow-games.component.html',
  styleUrls: ['./borrow-games.component.scss']
})
export class BorrowGamesComponent implements OnInit, OnDestroy {
  displayedColumnsBoardGames = ['borrow', 'status', 'borrowedBy', 'category', 'name', 'poids', 'ref'];
  displayedColumnsVideoGame = ['borrow', 'status', 'borrowedBy', 'category', 'name', 'ref'];
  displayedColumnsOutsideGame = ['borrow', 'status', 'borrowedBy', 'name', 'ref'];
  displayedColumnsGameOfUser = ['borrow', 'date', 'name', 'ref'];
  @ViewChild(MatSort) sort?: MatSort;
  search: string = '';
  boardGamePanelOpen: boolean = false;
  videoGamePanelOpen: boolean = false;
  outsideGamePanelOpen: boolean = false;
  employeeSearch: FormControl<string> = new FormControl<string>('');
  filteredOptions$?: Observable<Array<CseUser>>;
  gamesOfUser: Array<BorrowStatus> = [];
  users: Array<CseUser>;
  selectedUser?: CseUser;
  private usersSub: Subscription;

  constructor(public firebaseDatabaseService: FirebaseDatabaseService,
              private userService: UserService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.users = this.route.snapshot.data['users'];
    this.filteredOptions$ = this.employeeSearch.valueChanges.pipe(
      map((value) => this._filter(value || '', this.users)),
    );
    this.usersSub = this.userService.userList$.subscribe(userList => {
        this.users = userList;
        if (this.selectedUser) {
          const updatedUser = userList.find(user => user.id === this.selectedUser.id);
          this.selectEmployee({option: {value: updatedUser}} as MatAutocompleteSelectedEvent);
        }
    })
  }

  private _filter(value: string | CseUser, userList: Array<CseUser>): Array<CseUser> {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.firstName.toLowerCase();
    return userList.filter((item) => {
      const matchFirstName: boolean = item.firstName.toLowerCase().includes(filterValue);
      const matchLastName: boolean = item.firstName.toLowerCase().includes(filterValue);
      return matchFirstName || matchLastName;
    });
  }

  displayUser(user: CseUser): string {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  selectEmployee($event: MatAutocompleteSelectedEvent) {
    this.selectedUser = $event.option.value as CseUser;
    this.gamesOfUser = this.selectedUser?.borrowedGames ?
      Object.values(this.selectedUser.borrowedGames) : [];
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }
}
