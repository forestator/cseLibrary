import {Component, Input, OnInit} from '@angular/core';
import {VideoGame} from '../../../../models/videoGames.model';
import {ToolsService} from '../../../../services/tools.service';

@Component({
  selector: 'app-video-game-console-row',
  templateUrl: './video-game-console-row.component.html',
  styleUrls: ['./video-game-console-row.component.scss']
})
export class VideoGameConsoleRowComponent implements OnInit {

  @Input() videoGame!: VideoGame;
  @Input() selectedVideoGameId?: string;
  constructor(private toolsService: ToolsService) { }

  ngOnInit(): void {
    if (this.selectedVideoGameId) {
      this.toolsService.scrollToId(this.selectedVideoGameId);
    }
  }
}
