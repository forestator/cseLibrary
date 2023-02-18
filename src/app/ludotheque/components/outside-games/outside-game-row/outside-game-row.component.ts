import {Component, Input, OnInit} from '@angular/core';
import {OutsideGame} from '../../../../models/outsideGames.model';

@Component({
  selector: 'app-outside-game-row',
  templateUrl: './outside-game-row.component.html',
  styleUrls: ['./outside-game-row.component.scss']
})
export class OutsideGameRowComponent implements OnInit {

  @Input() game!: OutsideGame;
  @Input() index!: number;

  parity!: boolean;

  ngOnInit() {
    this.parity = this.index % 2 === 0;
  }
}
