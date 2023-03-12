import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {CseUser} from '../../../models/users.model';
import {
  ChangeBorrowStatusModalComponent
} from '../borrow-games/change-borrow-status/change-borrow-status-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {Game} from '../../../models/common.model';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';

@Component({
  selector: 'app-ludo-table',
  templateUrl: './ludo-table.component.html',
  styleUrls: ['./ludo-table.component.scss']
})
export class LudoTableComponent implements OnInit, OnChanges {
  @Input() games?: Array<Game> | null;
  @Input() displayedColumns!: Array<string>;
  @Input() users?: Array<CseUser>;
  @Input() returnForUser?: CseUser;
  @Input() filterBy?: string;
  dataSource?: MatTableDataSource<Game>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, private firebaseDatabaseService: FirebaseDatabaseService) {
  }

  ngOnInit() {
    if (this.games) {
      this.setDatasource(this.games);
    }
  }

  private setDatasource(games: Array<Game>) {
    if (this.filterBy) {
      this.dataSource = new MatTableDataSource<Game>(games.filter(game =>
        game.name.toLowerCase().includes(this.filterBy?.toLowerCase() ?? '')));
    } else {
      this.dataSource = new MatTableDataSource<Game>(games);
    }
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.games) this.setDatasource(this.games);
  }

  borrowGame(game: Game) {
    this.dialog.open(ChangeBorrowStatusModalComponent, {
      data: {users: this.users, game: game, returnForUser: this.returnForUser},
    });
  }

  returnGame(game: Game) {
    this.firebaseDatabaseService.removeBorrowForUser(game, this.returnForUser);
  }
}
