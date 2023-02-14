import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BoardGame} from '../../../../../models/boardGame.model';
import {ToolsService} from '../../../../../services/tools.service';
import {ChangeBorrowStatusComponent} from '../../../change-borrow-status/change-borrow-status.component';
import {MatDialog} from '@angular/material/dialog';
import {take} from 'rxjs';

@Component({
  selector: 'app-board-game-row',
  templateUrl: './board-game-row.component.html',
  styleUrls: ['./board-game-row.component.scss']
})
export class BoardGameRowComponent implements OnInit, OnChanges {

  @Input() boardGame: BoardGame | null = null;
  @Input() index!: number;
  @Input() selectedBoardGameId?: string;

  parity!: boolean;

  constructor(public toolsService: ToolsService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.parity = this.index % 2 === 0;
    if (this.selectedBoardGameId) {
      this.toolsService.scrollToId(this.selectedBoardGameId);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedBoardGameId'] && !!changes['selectedBoardGameId'].currentValue) {
      this.toolsService.scrollToId(changes['selectedBoardGameId'].currentValue);
    }
  }

  openBorrowModal(boardGame: BoardGame) {
    const dialogRef = this.dialog.open(ChangeBorrowStatusComponent, {
      data: {boardGame},
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((newDatas: {newStatus: boolean, employee: string}) => {
      console.log('The dialog was closed, change status of bg with informations : ' + JSON.stringify(newDatas));
    });
  }
}
