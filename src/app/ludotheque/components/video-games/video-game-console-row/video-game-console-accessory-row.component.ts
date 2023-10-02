import {Component, Input, OnInit} from '@angular/core';
import {VideoGame} from '../../../../models/videoGames.model';
import {ToolsService} from '../../../../services/biblio/tools.service';
import {BorrowByComission, BorrowStatus} from '../../../../admin/models/borrow.model';
import {take} from 'rxjs';
import {
  ChangeBorrowStatusModalComponent
} from '../../../../admin/components/emprunts/change-borrow-status/change-borrow-status-modal.component';
import {UserService} from '../../../../services/firebase/user.service';
import {MatDialog} from '@angular/material/dialog';
import {Comissions} from '../../../../models/common.model';

@Component({
  selector: 'app-video-game-console-accessory-row',
  templateUrl: './video-game-console-accessory-row.component.html',
  styleUrls: ['./video-game-console-accessory-row.component.scss']
})
export class VideoGameConsoleAccessoryRowComponent implements OnInit {

  @Input() videoGame!: VideoGame;
  @Input() selectedVideoGameId?: string;
  @Input() borrowsInfo: BorrowByComission[];

  borrowStatus = BorrowStatus;

  constructor(private toolsService: ToolsService,
              public dialog: MatDialog,
              private userService: UserService) {
  }

  ngOnInit(): void {
    console.log(this.borrowsInfo);
    if (this.selectedVideoGameId) {
      this.toolsService.scrollToId(this.selectedVideoGameId);
    }
  }

  reserve(videoGame: VideoGame) {
    this.userService.userList$.pipe(take(1)).subscribe(
      (users) => {
        this.dialog.open(ChangeBorrowStatusModalComponent, {
          data: {users, comission: Comissions.LUDOTHEQUE, object: videoGame}
        });
      }
    );
  }
}
