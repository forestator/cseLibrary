import { Component, Input, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
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


    @Input() game!: Game;
    @Input() index!: number;
    @Input() selectedGame?: string;

    parity!: boolean;

    ngOnInit() {
        this.parity = this.index % 2 === 0;
        if (this.selectedGame) {
            this.toolsService.scrollToId(this.selectedGame);
        }
    }
}
