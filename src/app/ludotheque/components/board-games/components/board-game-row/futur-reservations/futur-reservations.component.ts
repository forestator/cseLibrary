import {Component, Input} from '@angular/core';
import {Game} from '../../../../../../models/common.model';

@Component({
  selector: 'app-futur-reservations',
  templateUrl: './futur-reservations.component.html',
  styleUrls: ['./futur-reservations.component.scss']
})
export class FuturReservationsComponent {
  @Input() game: Game;
}
