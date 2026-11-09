import {Component, OnInit, ChangeDetectionStrategy, input} from '@angular/core';
import {Series, SeriesStatus} from 'src/app/models/author.model';

@Component({
    selector: 'app-series-badge',
    templateUrl: './series-badge.component.html',
    styleUrls: ['./series-badge.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class SeriesBadgeComponent implements OnInit {

  readonly series = input.required<Series>();

  txt!: string;
  bg!: string;
  fg!: string;

  constructor() { }

  ngOnInit(): void {
    const series = this.series();
    switch (series.status) {
      case SeriesStatus.NEW:
        this.txt = 'NOUVEAU';
        this.bg = 'chartreuse';
        this.fg = 'white';
        break;
      case SeriesStatus.IN_PROGRESS:
        this.txt = 'EN COURS...';
        this.bg = '#00C000';
        this.fg = 'white';
        break;
      case SeriesStatus.INCOMPLETE:
        this.txt = 'INCOMPLETE';
        this.bg = 'orange';
        this.fg = 'white';
        break;
      case SeriesStatus.FINISHED:
        this.txt = 'COMPLETE';
        this.bg = 'green';
        this.fg = 'white';
        break;
      case SeriesStatus.DECLASSED:
        this.txt = 'DECLASSEE';
        this.bg = 'red';
        this.fg = 'white';
        break;
      case SeriesStatus.ONE_SHOT:
        this.txt = 'UNIQUE';
        this.bg = '#00A000';
        this.fg = 'white';
        break;
      default:
        this.txt = series.status;
        this.bg = 'gray';
        this.fg = 'black';
    }
  }
}
