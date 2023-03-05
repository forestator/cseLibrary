import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {BoardGame} from '../../../models/boardGame.model';
import {VideoGame} from '../../../models/videoGames.model';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {BorrowStatus, CseUser} from '../../../models/users.model';
import {
  ChangeBorrowStatusModalComponent
} from '../borrow-games/change-borrow-status/change-borrow-status-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {Game} from '../../../models/common.model';

@Component({
  selector: 'app-ludo-table',
  templateUrl: './ludo-table.component.html',
  styleUrls: ['./ludo-table.component.scss']
})
export class LudoTableComponent implements OnInit, OnChanges {
  @Input() games?: Array<BoardGame | VideoGame | Game | BorrowStatus> | null;
  @Input() displayedColumns!: Array<string>;
  @Input() users?: Array<CseUser>;
  @Input() returnForUser?: CseUser;
  @Input() filterBy?: string;
  dataSource?: MatTableDataSource<BoardGame | VideoGame | Game | BorrowStatus>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.games) {
      this.setDatasource(this.games);
    }
  }

  private setDatasource(games: Array<BoardGame | VideoGame | Game | BorrowStatus>) {
    if (this.filterBy) {
      this.dataSource = new MatTableDataSource(games.filter(game =>
        game.name.toLowerCase().includes(this.filterBy?.toLowerCase() ?? '')));
    } else {
      this.dataSource = new MatTableDataSource(games);
    }
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.games) this.setDatasource(this.games);
  }

  borrowGame(game: BoardGame | VideoGame | Game | BorrowStatus) {
    this.dialog.open(ChangeBorrowStatusModalComponent, {
      data: {users: this.users, game: game, returnForUser: this.returnForUser},
    });
  }
}
