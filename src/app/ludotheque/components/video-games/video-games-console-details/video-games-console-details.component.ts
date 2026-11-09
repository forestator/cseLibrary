import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {MatDivider} from '@angular/material/divider';
import {VideoGame, VideoGameType} from '../../../../models/videoGames.model';
import {VideoGameRowComponent, VideoGameRowVariant} from '../video-game-row/video-game-row.component';

interface VideoGameSection {
  title: string;
  variant: VideoGameRowVariant;
  videoGames: ReadonlyArray<VideoGame>;
}

@Component({
  selector: 'app-video-games-console-details',
  templateUrl: './video-games-console-details.component.html',
  styleUrl: './video-games-console-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDivider, VideoGameRowComponent],
})
export class VideoGamesConsoleDetailsComponent {
  readonly videoGames = input<ReadonlyArray<VideoGame>>();
  readonly selectedId = input<string>();

  protected readonly hardwareSections = computed<Array<VideoGameSection>>(() => [
    {title: 'Consoles', variant: 'console', videoGames: this.ofType(VideoGameType.CONSOLE)},
    {title: 'Accessoires', variant: 'console', videoGames: this.ofType(VideoGameType.ACCESSORY)},
  ].filter(section => section.videoGames.length > 0) as Array<VideoGameSection>);

  protected readonly games = computed(() => this.ofType(VideoGameType.GAME));

  private ofType(type: VideoGameType): ReadonlyArray<VideoGame> {
    return this.videoGames()?.filter(videoGame => videoGame?.type === type) ?? [];
  }
}
