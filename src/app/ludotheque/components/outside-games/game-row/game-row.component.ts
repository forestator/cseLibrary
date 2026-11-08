import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Game} from '../../../../models/common.model';
import {ToolsService} from '../../../../services/biblio/tools.service';
import {UserService} from '../../../../services/firebase/user.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-game-row',
    templateUrl: './game-row.component.html',
    styleUrls: ['./game-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class GameRowComponent implements OnInit {

    @Input() game!: Game;
    @Input() index!: number;
    @Input() selectedGame?: string;

    parity!: boolean;

    constructor(public toolsService: ToolsService,
                public dialog: MatDialog,
                private userService: UserService) {
    }

    ngOnInit() {
        this.parity = this.index % 2 === 0;
        if (this.selectedGame) {
            this.toolsService.scrollToId(this.selectedGame);
        }
    }
}
