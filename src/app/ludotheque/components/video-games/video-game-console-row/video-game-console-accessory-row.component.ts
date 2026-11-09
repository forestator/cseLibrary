import { Component, Input, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import {VideoGame} from '../../../../models/videoGames.model';
import {ToolsService} from '../../../../services/biblio/tools.service';
import {UserService} from '../../../../services/firebase/user.service';
import {MatDialog} from '@angular/material/dialog';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'app-video-game-console-accessory-row',
    templateUrl: './video-game-console-accessory-row.component.html',
    styleUrls: ['./video-game-console-accessory-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgTemplateOutlet]
})
export class VideoGameConsoleAccessoryRowComponent implements OnInit {
  private toolsService = inject(ToolsService);
  dialog = inject(MatDialog);
  private userService = inject(UserService);


  @Input() videoGame!: VideoGame;
  @Input() selectedVideoGameId?: string;

  ngOnInit(): void {
    if (this.selectedVideoGameId) {
      this.toolsService.scrollToId(this.selectedVideoGameId);
    }
  }
}
