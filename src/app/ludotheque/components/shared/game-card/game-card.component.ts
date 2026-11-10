import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, input, linkedSignal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {Game} from '../../../../models/common.model';
import {ScrollToSelectedDirective} from '../../../directives/scroll-to-selected.directive';
import {categoryLabel} from '../../../pipes/game-category-label.pipe';
import {GameFact} from '../../../models';

/** Card of a game, console or accessory: cover, name, category, key facts, and a toggle for the rest. */
@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, NgOptimizedImage, ScrollToSelectedDirective],
  host: {'[class.game-card-open]': 'open()'},
})
export class GameCardComponent {
  readonly game = input.required<Game>();
  readonly selectedId = input<string>();
  /** Id of the card in the page, defaults to the game reference. */
  readonly anchorId = input<string>();
  readonly facts = input<ReadonlyArray<GameFact>>([]);
  readonly details = input<ReadonlyArray<string>>([]);
  readonly description = input<string>();
  readonly showCategory = input(true);
  /** Loads the cover eagerly: set on the first cards, which are most likely above the fold. */
  readonly priority = input(false);

  protected readonly cardId = computed(() => this.anchorId() ?? this.game().ref);
  protected readonly detailsId = computed(() => `${this.cardId()}-details`);
  protected readonly titleId = computed(() => `${this.cardId()}-title`);
  protected readonly selected = computed(() => !!this.selectedId() && this.selectedId() === this.cardId());
  protected readonly category = computed(() => this.showCategory() && this.game().category ? categoryLabel(this.game().category) : undefined);
  protected readonly hasDetails = computed(() => this.details().length > 0 || !!this.description());
  /** A game reached through the route starts with its details open. */
  protected readonly open = linkedSignal(() => this.selected());

  protected toggle(): void {
    this.open.update(open => !open);
  }
}
