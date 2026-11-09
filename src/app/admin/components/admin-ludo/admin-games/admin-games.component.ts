import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {FirebaseDatabaseService} from '../../../../services/firebase/firebase-database.service';
import {MatDialog} from '@angular/material/dialog';
import {AddGameModalComponent} from './add-game-modal/add-game-modal.component';
import {combineLatest, take} from 'rxjs';
import {EditGameModalComponent} from './edit-game-modal/edit-game-modal.component';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { LudoTableComponent } from '../ludo-table/ludo-table.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-admin-games',
    templateUrl: './admin-games.component.html',
    styleUrls: ['./admin-games.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatButton, MatDivider, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, LudoTableComponent, AsyncPipe]
})
export class AdminGamesComponent {
    firebaseDatabaseService = inject(FirebaseDatabaseService);
    private dialog = inject(MatDialog);

    columnsBoardGames = ['category', 'name', 'poids', 'ref'];
    columnsVideoGame = ['category', 'name', 'ref'];
    columnsOutsideGame = ['category', 'name', 'ref'];
    search = '';
    boardGamePanelOpen = false;
    videoGamePanelOpen = false;
    outsideGamePanelOpen = false;

    addGame() {
        combineLatest([
            this.firebaseDatabaseService.boardGamesOneShot$,
            this.firebaseDatabaseService.videoGamesOneShot$,
            this.firebaseDatabaseService.outsideGamesOneShot$
        ]).pipe(take(1)).subscribe(([a, b, c]) => {
            this.dialog.open(AddGameModalComponent, {
                data: {games: [...a, ...b, ...c]}
            });
        })
    }

    editGame() {
        combineLatest([
            this.firebaseDatabaseService.boardGamesOneShot$,
            this.firebaseDatabaseService.videoGamesOneShot$,
            this.firebaseDatabaseService.outsideGamesOneShot$
        ]).pipe(take(1)).subscribe(([a, b, c]) => {
            this.dialog.open(EditGameModalComponent, {
                data: {games: [...a, ...b, ...c]}
            });
        })
    }
}
