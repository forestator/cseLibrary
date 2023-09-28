import {Pipe, PipeTransform} from '@angular/core';
import {BorrowByComission} from '../../admin/models/borrow.model';
import {Comissions, Game} from '../../models/common.model';
import {Tool} from '../../bricolage/models/bricolage.model';

@Pipe({
  name: 'filterBorrowById'
})
export class FilterBorrowByIDPipe implements PipeTransform {

  transform(value: BorrowByComission, id: string): BorrowByComission | null {
    if (value?.comission === Comissions.LUDOTHEQUE) {
      const game = value.item as Game;
      if (game.ref === id) {
        return value;
      }
    } else if (value?.comission === Comissions.BRICOLAGE) {
      const tool = value.item as Tool;
      if (tool.id.toString() === id) {
        return value;
      }
    }
    return null;
  }

}
