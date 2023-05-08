import {Pipe, PipeTransform} from '@angular/core';
import {Moment} from 'moment';

@Pipe({
  name: 'momentToDate'
})
export class MomentToDatePipe implements PipeTransform {

  transform(value: Moment): string {
    return value.locale('fr').format('L');
  }

}
