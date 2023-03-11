import {Pipe, PipeTransform} from '@angular/core';
import {BorrowInfo} from '../../models/common.model';
import moment from 'moment/moment';

@Pipe({
  name: 'gameReservedForFuturWeeks'
})
export class GameReservedForFuturWeeksPipe implements PipeTransform {

  transform(borrowInfos: Array<BorrowInfo> | undefined): Array<BorrowInfo> | null {
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
