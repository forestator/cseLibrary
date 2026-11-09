import { ChangeDetectionStrategy, Component, OnChanges, OnInit, SimpleChanges, inject, input } from '@angular/core';
import {BoardGame} from '../../../../../models/boardGame.model';
import {ToolsService} from '../../../../../services/biblio/tools.service';
import {MatDialog} from '@angular/material/dialog';
import {UserService} from '../../../../../services/firebase/user.service';
import { NgTemplateOutlet, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-board-game-row',
    templateUrl: './board-game-row.component.html',
    styleUrls: ['./board-game-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet, AsyncPipe]
})
export class BoardGameRowComponent implements OnInit, OnChanges {
  toolsService = inject(ToolsService);
  dialog = inject(MatDialog);
  private userService = inject(UserService);


  readonly boardGame = input<BoardGame | null>(null);
  readonly index = input.required<number>();
  readonly selectedBoardGameId = input<string>(undefined);

  parity!: boolean;

  ngOnInit(): void {
    this.parity = this.index() % 2 === 0;
    const selectedBoardGameId = this.selectedBoardGameId();
    if (selectedBoardGameId) {
      this.toolsService.scrollToId(selectedBoardGameId);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedBoardGameId'] && !!changes['selectedBoardGameId'].currentValue) {
      this.toolsService.scrollToId(changes['selectedBoardGameId'].currentValue);
    }
  }

}
