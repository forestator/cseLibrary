import { Component, OnInit, ChangeDetectionStrategy, inject, input } from '@angular/core';
import {Game} from '../../../../models/common.model';
import {ToolsService} from '../../../../services/biblio/tools.service';
import {UserService} from '../../../../services/firebase/user.service';
import {MatDialog} from '@angular/material/dialog';
import { NgTemplateOutlet, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-game-row',
    templateUrl: './game-row.component.html',
    styleUrls: ['./game-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgTemplateOutlet, AsyncPipe]
})
export class GameRowComponent implements OnInit {
    toolsService = inject(ToolsService);
    dialog = inject(MatDialog);
    private userService = inject(UserService);


    readonly game = input.required<Game>();
    readonly index = input.required<number>();
    readonly selectedGame = input<string>(undefined);

    parity!: boolean;

    ngOnInit() {
        this.parity = this.index() % 2 === 0;
        const selectedGame = this.selectedGame();
        if (selectedGame) {
            this.toolsService.scrollToId(selectedGame);
        }
    }
}
