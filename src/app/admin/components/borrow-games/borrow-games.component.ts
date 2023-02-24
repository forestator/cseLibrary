import {Component, OnInit, ViewChild} from '@angular/core';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {MatSort} from '@angular/material/sort';
import {map, Observable} from 'rxjs';
import {BoardGame} from '../../../models/boardGame.model';
import {FormControl} from '@angular/forms';
import {BorrowStatus, CseUser} from '../../../models/users.model';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-borrow-games',
  templateUrl: './borrow-games.component.html',
  styleUrls: ['./borrow-games.component.scss']
})
export class BorrowGamesComponent implements OnInit {
  displayedColumnsBoardGames = ['borrow', 'status', 'borrowedBy', 'category', 'name', 'poids', 'ref'];
  displayedColumnsVideoGame = ['borrow', 'status', 'borrowedBy', 'category', 'name', 'ref'];
  displayedColumnsOutsideGame = ['borrow', 'status', 'borrowedBy', 'name', 'ref'];
  displayedColumnsGameOfUser = ['borrow', 'date', 'name', 'ref'];
  @ViewChild(MatSort) sort?: MatSort;
  boardGamesSource$: Observable<Array<BoardGame>> = this.firebaseDatabaseService.boardGames$;
  search: string = '';
  boardGamePanelOpen: boolean = false;
  videoGamePanelOpen: boolean = false;
  outsideGamePanelOpen: boolean = false;
  employeeSearch: FormControl<string> = new FormControl<string>('');
  filteredOptions$?: Observable<Array<CseUser>>;
  gamesOfUser: Array<BorrowStatus> = [];
  users: Array<CseUser>;
  selectedUser?: CseUser;

  constructor(public firebaseDatabaseService: FirebaseDatabaseService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.users = this.route.snapshot.data['users'];
    this.filteredOptions$ = this.employeeSearch.valueChanges.pipe(
      map((value) => this._filter(value || '', this.users)),
    );
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
}
