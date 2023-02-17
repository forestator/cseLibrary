import {Component, Input, OnInit} from '@angular/core';
import {VideoGame} from '../../../../models/videoGames.model';
import {ToolsService} from '../../../../services/tools.service';

@Component({
  selector: 'app-video-game-accessory-row',
  templateUrl: './video-game-accessory-row.component.html',
  styleUrls: ['./video-game-accessory-row.component.scss']
})
export class VideoGameAccessoryRowComponent implements OnInit {
  @Input() videoGame!: VideoGame;
  @Input() selectedVideoGameId?: string;
  constructor(private toolsService: ToolsService) { }

  ngOnInit(): void {
    if (this.selectedVideoGameId) {
      this.toolsService.scrollToId(this.selectedVideoGameId);
    }
  }
}
