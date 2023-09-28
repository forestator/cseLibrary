import {Pipe, PipeTransform} from '@angular/core';
import {BorrowByComission} from '../../admin/models/borrow.model';
import {Comissions, Game} from '../../models/common.model';
import {Tool} from '../../bricolage/models/bricolage.model';

@Pipe({
  name: 'filterBorrowById'
})
export class FilterBorrowByIDPipe implements PipeTransform {

  transform(values: BorrowByComission[], id: string): BorrowByComission | null {
    let returnValue: BorrowByComission | null = null;
    if (values) {
      const comission = values[0]?.comission;
      if (comission === Comissions.LUDOTHEQUE) {
        returnValue = values.find(val => (val.item as Game).ref === id);
      } else if (comission === Comissions.BRICOLAGE) {
        returnValue = values.find(val => (val.item as Tool).id.toString() === id);
      }
    }
    return returnValue;
  }

}
