import {Component, ViewChild} from '@angular/core';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {MatSort} from '@angular/material/sort';
import {combineLatest, Observable, take} from 'rxjs';
import {BoardGame} from '../../../models/boardGame.model';
import {MatDialog} from '@angular/material/dialog';
import {AddEmployeeDialogComponent} from '../add-employee-dialog/add-employee-dialog.component';
import {UserService} from '../../../services/firebase/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-borrow-games',
  templateUrl: './borrow-games.component.html',
  styleUrls: ['./borrow-games.component.scss']
})
export class BorrowGamesComponent {
  displayedColumnsBoardGames = ['status', 'category', 'name', 'poids', 'ref'];
  displayedColumnsVideoGame = ['status', 'category', 'name', 'ref'];
  displayedColumnsOutsideGame = ['status', 'name', 'ref'];
  @ViewChild(MatSort) sort?: MatSort;
  boardGamesSource$: Observable<Array<BoardGame>> = this.firebaseDatabaseService.boardGames$;
  search: string = '';
  boardGamePanelOpen: boolean = false;
  videoGamePanelOpen: boolean = false;
  outsideGamePanelOpen: boolean = false;

  constructor(public firebaseDatabaseService: FirebaseDatabaseService,
              private userService: UserService,
              private snackBar: MatSnackBar,
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
            newUSer.id = users.length;
            this.userService.addUser(newUSer);
          } else {
            this.snackBar.open('Cet utilisateur existe déjà', 'Ok');
          }
        }
      });
  };
}
