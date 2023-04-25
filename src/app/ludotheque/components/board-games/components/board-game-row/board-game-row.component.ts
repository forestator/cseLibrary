import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BoardGame} from '../../../../../models/boardGame.model';
import {ToolsService} from '../../../../../services/biblio/tools.service';
import {MatDialog} from '@angular/material/dialog';
import {UserService} from '../../../../../services/firebase/user.service';
import {Game} from '../../../../../models/common.model';
import {take} from 'rxjs';
import {
  ChangeBorrowStatusModalComponent
} from '../../../../../admin/components/emprunts/change-borrow-status/change-borrow-status-modal.component';

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


  constructor(public toolsService: ToolsService,
              public dialog: MatDialog,
              private userService: UserService) {
  }

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

  borrowGame(game: Game) {
    this.userService.userList$.pipe(take(1)).subscribe(
      (users) => {
        this.dialog.open(ChangeBorrowStatusModalComponent, {
          data: {users, game: game}
        });
      }
    );
  }
}
