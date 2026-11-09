import {Component, ChangeDetectionStrategy, input} from '@angular/core';
import {Consoles, VideoGame, VideoGameType} from '../../../../models/videoGames.model';
import { VideoGameConsoleAccessoryRowComponent } from '../video-game-console-row/video-game-console-accessory-row.component';
import { MatDivider } from '@angular/material/divider';
import { VideoGameRowComponent } from '../video-game-row/video-game-row.component';
import { FilterVideoGameByTypePipe } from '../../../pipes/filter-video-game-by-type.pipe';

@Component({
    selector: 'app-video-games-console-details',
    templateUrl: './video-games-console-details.component.html',
    styleUrls: ['./video-games-console-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [VideoGameConsoleAccessoryRowComponent, MatDivider, VideoGameRowComponent, FilterVideoGameByTypePipe]
})
export class VideoGamesConsoleDetailsComponent {
  videoGameType = VideoGameType;
  readonly selectedVideoGameId = input<string>(undefined);
  readonly consoleId = input<Consoles>(undefined);
  readonly videoGames = input<Array<VideoGame> | null>(undefined);


  trackVideoGame(index: number, item: VideoGame) {
    return item.ref;
  }
}
