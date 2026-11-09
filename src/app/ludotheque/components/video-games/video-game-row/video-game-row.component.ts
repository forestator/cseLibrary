import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy, inject, input } from '@angular/core';
import {VideoGame} from '../../../../models/videoGames.model';
import {ToolsService} from '../../../../services/biblio/tools.service';
import {UserService} from '../../../../services/firebase/user.service';
import {MatDialog} from '@angular/material/dialog';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'app-video-game-row',
    templateUrl: './video-game-row.component.html',
    styleUrls: ['./video-game-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgTemplateOutlet]
})
export class VideoGameRowComponent implements OnInit, OnChanges {
  private toolsService = inject(ToolsService);
  dialog = inject(MatDialog);
  private userService = inject(UserService);


  readonly videoGame = input.required<VideoGame>();
  readonly selectedVideoGameId = input<string>(undefined);
  ngOnInit(): void {
    const selectedVideoGameId = this.selectedVideoGameId();
    if (selectedVideoGameId) {
      this.toolsService.scrollToId(selectedVideoGameId);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedVideoGameId'] && !!changes['selectedVideoGameId'].currentValue) {
      this.toolsService.scrollToId(changes['selectedVideoGameId'].currentValue);
    }
  }
}
