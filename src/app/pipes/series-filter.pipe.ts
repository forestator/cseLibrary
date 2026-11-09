import { Pipe, PipeTransform } from '@angular/core';
import { BookStatus, Series } from '../models/author.model';

@Pipe({ name: 'seriesFilter' })
export class SeriesFilterPipe implements PipeTransform {

  transform(series: Array<Series> | undefined, isAdmin: boolean): Array<Series> {
    let filteredSeries: Array<Series> = [];
    if (series) {
      if (isAdmin) {
        filteredSeries = series;
      } else {
        series.forEach(s => {
          let book = s.books?.find(b => b.status !== BookStatus.DECLASSED && b.status !== BookStatus.MISSING);
          if (book) {
            filteredSeries.push(s);
          }
        });
      }
    }
    return filteredSeries;
  }

}
