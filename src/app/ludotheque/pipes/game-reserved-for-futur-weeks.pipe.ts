import {Pipe, PipeTransform} from '@angular/core';
import moment from 'moment/moment';
import {Borrow} from '../../admin/models/borrow.model';

@Pipe({
  name: 'gameReservedForFuturWeeks'
})
export class GameReservedForFuturWeeksPipe implements PipeTransform {

  transform(borrowInfos: Array<Borrow> | undefined): Array<Borrow> | null {
    let gameReserved = null;
    if (borrowInfos) {
      const filteredBorrow = borrowInfos.filter(borrow => {
        const compareDate = moment(new Date(), 'DD/MM/YYYY');
        const startDate = moment(borrow.startDate, 'DD/MM/YYYY');
        return compareDate.isBefore(startDate);
      });
      gameReserved = filteredBorrow.length > 0 ? filteredBorrow : null;
    }
    return gameReserved;
  }

}
