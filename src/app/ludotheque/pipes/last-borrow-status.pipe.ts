import {Pipe, PipeTransform} from '@angular/core';
import {BorrowByComission, BorrowStatus} from '../../admin/models/borrow.model';

@Pipe({
  name: 'LastBorrowStatus'
})
export class LastBorrowStatusPipe implements PipeTransform {

  transform(value: BorrowByComission[]): BorrowStatus {
    const lastBorrow: BorrowByComission = value[value.length - 1];
    return lastBorrow?.status ?? BorrowStatus.AVAILABLE;
  }

}
