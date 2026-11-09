import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';

/** Placeholder shown while the catalogue is loading. */
@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  readonly variant = input<'cards' | 'list'>('cards');
  readonly count = input(6);

  protected readonly items = computed(() => Array.from({length: this.count()}, (_, index) => index));
}
