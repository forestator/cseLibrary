import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {VideoGame} from '../../../../models/videoGames.model';
import {ToolsService} from '../../../../services/biblio/tools.service';
import {UserService} from '../../../../services/firebase/user.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-video-game-row',
    templateUrl: './video-game-row.component.html',
    styleUrls: ['./video-game-row.component.scss'],
    standalone: false
})
export class VideoGameRowComponent implements OnInit, OnChanges {

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedVideoGameId'] && !!changes['selectedVideoGameId'].currentValue) {
      this.toolsService.scrollToId(changes['selectedVideoGameId'].currentValue);
    }
  }
}
