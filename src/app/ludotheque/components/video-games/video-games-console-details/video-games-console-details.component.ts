import {Component, Input} from '@angular/core';
import {Consoles, VideoGame, VideoGameType} from '../../../../models/videoGames.model';

@Component({
  selector: 'app-video-games-console-details',
  templateUrl: './video-games-console-details.component.html',
  styleUrls: ['./video-games-console-details.component.scss']
})
export class VideoGamesConsoleDetailsComponent {
  videoGameType = VideoGameType;
  @Input() selectedVideoGameId?: string;
  @Input() consoleId?: Consoles;
  @Input() videoGames?: Array<VideoGame> | null;

  constructor() {
  }
  trackVideoGame(index: number, item: VideoGame) {
    return item.ref + item.status;
  }
}
