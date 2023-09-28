import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {VideoGame} from '../../../../models/videoGames.model';
import {ToolsService} from '../../../../services/biblio/tools.service';
import {Comissions, Game} from '../../../../models/common.model';
import {take} from 'rxjs';
import {
  ChangeBorrowStatusModalComponent
} from '../../../../admin/components/emprunts/change-borrow-status/change-borrow-status-modal.component';
import {UserService} from '../../../../services/firebase/user.service';
import {MatDialog} from '@angular/material/dialog';
import {BorrowByComission, BorrowStatus} from '../../../../admin/models/borrow.model';

@Component({
  selector: 'app-video-game-row',
  templateUrl: './video-game-row.component.html',
  styleUrls: ['./video-game-row.component.scss']
})
export class VideoGameRowComponent implements OnInit, OnChanges {

  @Input() videoGame!: VideoGame;
  @Input() selectedVideoGameId?: string;
  @Input() borrowsInfo: BorrowByComission | null;

  borrowStatus = BorrowStatus;

  constructor(private toolsService: ToolsService,
              public dialog: MatDialog,
              private userService: UserService) {
  }
  ngOnInit(): void {
    if (this.selectedVideoGameId) {
      this.toolsService.scrollToId(this.selectedVideoGameId);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedVideoGameId'] && !!changes['selectedVideoGameId'].currentValue) {
      this.toolsService.scrollToId(changes['selectedVideoGameId'].currentValue);
    }
  }

  reserveVideoGame(game: Game) {
    this.userService.userList$.pipe(take(1)).subscribe(
      (users) => {
        this.dialog.open(ChangeBorrowStatusModalComponent, {
          data: {users, comission: Comissions.LUDOTHEQUE, object: game}
        });
      }
    );
  }

  protected readonly BorrowStatus = BorrowStatus;
}
