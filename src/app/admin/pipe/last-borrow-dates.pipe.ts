import {Pipe, PipeTransform} from '@angular/core';
import {Game} from '../../models/common.model';

@Pipe({
  name: 'lastBorrowDates'
})
export class LastBorrowDatesPipe implements PipeTransform {

  transform(game: Game): string {
    const lastBorrow = game.borrowList[game.borrowList.length - 1];
    return `Du ${lastBorrow.startDate} au ${lastBorrow.endDate}`;
  }

}
