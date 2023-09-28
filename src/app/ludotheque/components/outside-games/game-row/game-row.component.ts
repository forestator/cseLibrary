import {Component, Input, OnInit} from '@angular/core';
import {Comissions, Game} from '../../../../models/common.model';
import {ToolsService} from '../../../../services/biblio/tools.service';
import {
  ChangeBorrowStatusModalComponent
} from '../../../../admin/components/emprunts/change-borrow-status/change-borrow-status-modal.component';
import {UserService} from '../../../../services/firebase/user.service';
import {take} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {BorrowByComission, BorrowStatus} from '../../../../admin/models/borrow.model';

@Component({
  selector: 'app-game-row',
  templateUrl: './game-row.component.html',
  styleUrls: ['./game-row.component.scss']
})
export class GameRowComponent implements OnInit {

  @Input() game!: Game;
  @Input() index!: number;
  @Input() selectedGame?: string;
  @Input() borrowsInfo: BorrowByComission | null;

  borrowStatus = BorrowStatus;
  parity!: boolean;

  constructor(public toolsService: ToolsService,
              public dialog: MatDialog,
              private userService: UserService) {
  }

  ngOnInit() {
    this.parity = this.index % 2 === 0;

    if (this.selectedGame) {
      this.toolsService.scrollToId(this.selectedGame);
    }
  }

  reserve(game: Game) {
    this.userService.userList$.pipe(take(1)).subscribe(
      (users) => {
        this.dialog.open(ChangeBorrowStatusModalComponent, {
          data: {users, comission: Comissions.LUDOTHEQUE, object: game}
        });
      }
    );
  }
}
