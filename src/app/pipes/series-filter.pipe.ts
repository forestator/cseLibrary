import {Pipe, PipeTransform} from '@angular/core';
import {Series} from '../models/author.model';
import {isBookVisible} from './book-filter.pipe';

/** Keeps the series that still have at least one visible book (all of them in admin mode). */
export function filterSeries(series: ReadonlyArray<Series> | undefined, isAdmin: boolean): Array<Series> {
  return isAdmin ? [...(series ?? [])] : (series ?? []).filter(item => item.books?.some(isBookVisible));
}

@Pipe({name: 'seriesFilter'})
export class SeriesFilterPipe implements PipeTransform {
  transform(series: ReadonlyArray<Series> | undefined, isAdmin: boolean): Array<Series> {
    return filterSeries(series, isAdmin);
  }
}
