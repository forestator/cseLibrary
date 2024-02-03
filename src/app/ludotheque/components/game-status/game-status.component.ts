import {Component, Input} from '@angular/core';
import {BorrowByComission} from '../../../admin/models/borrow.model';

@Component({
  selector: 'app-game-status',
  templateUrl: './game-status.component.html',
  styleUrls: ['./game-status.component.scss']
})
export class GameStatusComponent {

  @Input() gameBorrowInformation:BorrowByComission[];
}
