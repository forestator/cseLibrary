import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {VideoGame} from '../../../../models/videoGames.model';
import {ScrollToSelectedDirective} from '../../../directives/scroll-to-selected.directive';

export type VideoGameRowVariant = 'game' | 'console';

/** Compact tile for a video game, or wider row (with description) for a console or an accessory. */
@Component({
  selector: 'app-video-game-row',
  templateUrl: './video-game-row.component.html',
  styleUrl: './video-game-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollToSelectedDirective],
})
export class VideoGameRowComponent {
  readonly videoGame = input.required<VideoGame>();
  readonly variant = input<VideoGameRowVariant>('game');
  readonly selectedId = input<string>();
}
