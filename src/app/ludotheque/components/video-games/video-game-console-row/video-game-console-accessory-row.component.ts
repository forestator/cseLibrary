import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {VideoGame} from '../../../../models/videoGames.model';
import {ToolsService} from '../../../../services/biblio/tools.service';
import {UserService} from '../../../../services/firebase/user.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-video-game-console-accessory-row',
    templateUrl: './video-game-console-accessory-row.component.html',
    styleUrls: ['./video-game-console-accessory-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class VideoGameConsoleAccessoryRowComponent implements OnInit {

  @Input() videoGame!: VideoGame;
  @Input() selectedVideoGameId?: string;

  constructor(private toolsService: ToolsService,
              public dialog: MatDialog,
              private userService: UserService) {
  }

  ngOnInit(): void {
    if (this.selectedVideoGameId) {
      this.toolsService.scrollToId(this.selectedVideoGameId);
    }
  }
}
