import {Pipe, PipeTransform} from '@angular/core';
import {BorrowByComission} from '../../admin/models/borrow.model';
import {Comissions, Game} from '../../models/common.model';
import {Tool} from '../../bricolage/models/bricolage.model';
import {NautismeItem} from '../../nautisme/models/nautisme.model';
import {SonoItem} from '../../sonotheque/models/sono.model';

@Pipe({
  name: 'filterBorrowById'
})
export class FilterBorrowByIDPipe implements PipeTransform {

  transform(values: BorrowByComission[], item: Game | Tool | NautismeItem | SonoItem): BorrowByComission[] {
    console.log(values);
    console.log(item);
    let returnValue: BorrowByComission[] = [];
    if (values) {
      const comission = values[0]?.comission;
      if (comission === Comissions.LUDOTHEQUE) {
        const game = item as Game;
        returnValue = values.filter(val => (val.item as Game).ref === game.ref);
      } else if (comission === Comissions.BRICOLAGE) {
        const tool = item as Tool;
        returnValue = values.filter(val => (val.item as Tool).id.toString() === tool.id.toString());
      }
    }
    return returnValue;
  }

}
