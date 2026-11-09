import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {Series, SeriesStatus} from '../../../../models/author.model';

interface BadgeStyle {
  text: string;
  cssClass: string;
}

const BADGES: Record<SeriesStatus, BadgeStyle> = {
  [SeriesStatus.NEW]: {text: 'NOUVEAU', cssClass: 'badge-new'},
  [SeriesStatus.IN_PROGRESS]: {text: 'EN COURS...', cssClass: 'badge-in-progress'},
  [SeriesStatus.INCOMPLETE]: {text: 'INCOMPLETE', cssClass: 'badge-incomplete'},
  [SeriesStatus.FINISHED]: {text: 'COMPLETE', cssClass: 'badge-finished'},
  [SeriesStatus.DECLASSED]: {text: 'DECLASSEE', cssClass: 'badge-declassed'},
  [SeriesStatus.ONE_SHOT]: {text: 'UNIQUE', cssClass: 'badge-one-shot'},
};

@Component({
  selector: 'app-series-badge',
  templateUrl: './series-badge.component.html',
  styleUrl: './series-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeriesBadgeComponent {
  readonly series = input.required<Series>();

  protected readonly badge = computed<BadgeStyle>(() => {
    const status = this.series().status;
    return BADGES[status] ?? {text: status, cssClass: 'badge-default'};
  });
}
