import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

/** Large link card with a cover, used by the landing pages to reach a library or a category. */
@Component({
  selector: 'app-tile-card',
  templateUrl: './tile-card.component.html',
  styleUrl: './tile-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, NgOptimizedImage, RouterLink],
})
export class TileCardComponent {
  readonly route = input.required<string>();
  readonly title = input.required<string>();
  readonly resume = input<string>();
  readonly image = input<string>();
  /** Set on the first tile so its cover is loaded eagerly (it is the largest contentful paint). */
  readonly priority = input(false);
  /** Material icon shown instead of the cover when there is no image. */
  readonly icon = input('sports_esports');
}
