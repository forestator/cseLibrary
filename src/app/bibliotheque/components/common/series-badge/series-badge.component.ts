import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {Series, SeriesStatus} from '../../../../models/author.model';

interface BadgeStyle {
  text: string;
  tone: string;
}

const BADGES: Record<SeriesStatus, BadgeStyle> = {
  [SeriesStatus.NEW]: {text: 'Nouveau', tone: 'chip-info'},
  [SeriesStatus.IN_PROGRESS]: {text: 'En cours…', tone: 'chip-teal'},
  [SeriesStatus.INCOMPLETE]: {text: 'Incomplète', tone: 'chip-warning'},
  [SeriesStatus.FINISHED]: {text: 'Complète', tone: 'chip-success'},
  [SeriesStatus.DECLASSED]: {text: 'Déclassée', tone: 'chip-danger'},
  [SeriesStatus.ONE_SHOT]: {text: 'Unique', tone: 'chip-project'},
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
    return BADGES[status] ?? {text: status, tone: 'chip-neutral'};
  });
}
