import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {BoardGame} from '../../../models/boardGame.model';

@Component({
  selector: 'app-board-game-row',
  templateUrl: './board-game-row.component.html',
  styleUrls: ['./board-game-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardGameRowComponent implements OnInit {

  @Input() boardGame: BoardGame | null = null;
  @Input() index!: number;

  parity!: boolean;

  constructor() { }

  ngOnInit(): void {
    this.parity = this.index % 2 === 0;
  }

}
