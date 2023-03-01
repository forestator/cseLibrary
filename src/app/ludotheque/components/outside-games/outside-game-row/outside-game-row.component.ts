import {Component, Input, OnInit} from '@angular/core';
import {Game} from '../../../../models/common.model';

@Component({
  selector: 'app-outside-game-row',
  templateUrl: './outside-game-row.component.html',
  styleUrls: ['./outside-game-row.component.scss']
})
export class OutsideGameRowComponent implements OnInit {

  @Input() game!: Game;
  @Input() index!: number;

  parity!: boolean;

  ngOnInit() {
    this.parity = this.index % 2 === 0;
  }
}
