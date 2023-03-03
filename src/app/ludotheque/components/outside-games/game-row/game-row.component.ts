import {Component, Input, OnInit} from '@angular/core';
import {Game} from '../../../../models/common.model';

@Component({
  selector: 'app-game-row',
  templateUrl: './game-row.component.html',
  styleUrls: ['./game-row.component.scss']
})
export class GameRowComponent implements OnInit {

  @Input() game!: Game;
  @Input() index!: number;

  parity!: boolean;

  ngOnInit() {
    this.parity = this.index % 2 === 0;
  }
}
