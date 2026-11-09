import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {VideoGame, VideoGameType} from '../../../../models/videoGames.model';
import {GameCardComponent} from '../../shared/game-card/game-card.component';
import {GameGridComponent} from '../../shared/game-grid/game-grid.component';
import {SectionTitleComponent} from '../../shared/section-title/section-title.component';

interface VideoGameSection {
  title: string;
  videoGames: ReadonlyArray<VideoGame>;
}

/** Video games of a console, split in consoles, accessories and games; `undefined` means still loading. */
@Component({
  selector: 'app-video-games-console-details',
  templateUrl: './video-games-console-details.component.html',
  styleUrl: './video-games-console-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GameCardComponent, GameGridComponent, SectionTitleComponent],
})
export class VideoGamesConsoleDetailsComponent {
  readonly videoGames = input<ReadonlyArray<VideoGame>>();
  readonly selectedId = input<string>();
  readonly showCategory = input(true);

  protected readonly sections = computed<ReadonlyArray<VideoGameSection>>(() => [
    {title: 'Consoles', videoGames: this.ofType(VideoGameType.CONSOLE)},
    {title: 'Accessoires', videoGames: this.ofType(VideoGameType.ACCESSORY)},
    {title: 'Jeux', videoGames: this.ofType(VideoGameType.GAME)},
  ].filter(section => section.videoGames.length > 0));

  private ofType(type: VideoGameType): ReadonlyArray<VideoGame> {
    return this.videoGames()?.filter(videoGame => videoGame?.type === type) ?? [];
  }
}
