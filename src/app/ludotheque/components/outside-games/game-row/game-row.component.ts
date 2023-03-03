import {Component, Input, OnInit} from '@angular/core';
import {Game} from '../../../../models/common.model';
import {ToolsService} from '../../../../services/biblio/tools.service';

@Component({
  selector: 'app-game-row',
  templateUrl: './game-row.component.html',
  styleUrls: ['./game-row.component.scss']
})
export class GameRowComponent implements OnInit {

  @Input() game!: Game;
  @Input() index!: number;
  @Input() selectedGame?: string;
  parity!: boolean;

  constructor(private toolsService: ToolsService) {
  }

  ngOnInit() {
    this.parity = this.index % 2 === 0;

    if (this.selectedGame) {
      this.toolsService.scrollToId(this.selectedGame);
    }
  }
}
