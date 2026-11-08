import {Component} from '@angular/core';
import {FirebaseDatabaseService} from '../../../../services/firebase/firebase-database.service';
import {MatDialog} from '@angular/material/dialog';
import {AddGameModalComponent} from './add-game-modal/add-game-modal.component';
import {combineLatest, take} from 'rxjs';
import {EditGameModalComponent} from './edit-game-modal/edit-game-modal.component';

@Component({
    selector: 'app-admin-games',
    templateUrl: './admin-games.component.html',
    styleUrls: ['./admin-games.component.scss']
})
export class AdminGamesComponent {
    columnsBoardGames = ['category', 'name', 'poids', 'ref'];
    columnsVideoGame = ['category', 'name', 'ref'];
    columnsOutsideGame = ['category', 'name', 'ref'];
    search = '';
    boardGamePanelOpen = false;
    videoGamePanelOpen = false;
    outsideGamePanelOpen = false;

    constructor(public firebaseDatabaseService: FirebaseDatabaseService,
                private dialog: MatDialog) {
    }

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
