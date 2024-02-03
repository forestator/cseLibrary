import {Component} from '@angular/core';
import {FirebaseDatabaseService} from '../../../../services/firebase/firebase-database.service';
import {MatDialog} from '@angular/material/dialog';
import {AddGameModalComponent} from './add-game-modal/add-game-modal.component';
import {combineLatest, Observable, take} from 'rxjs';
import {EditGameModalComponent} from './edit-game-modal/edit-game-modal.component';
import {BorrowDataService} from '../../../services/borrow-data.service';
import {Comissions} from '../../../../models/common.model';
import {BorrowByComission} from '../../../models/borrow.model';

@Component({
    selector: 'app-admin-games',
    templateUrl: './admin-games.component.html',
    styleUrls: ['./admin-games.component.scss']
})
export class AdminGamesComponent {
    columnsBoardGames = ['status', 'category', 'name', 'poids', 'ref', 'stats'];
    columnsVideoGame = ['status', 'category', 'name', 'ref', 'stats'];
    columnsOutsideGame = ['status', 'category', 'name', 'ref', 'stats'];
    search = '';
    boardGamePanelOpen = false;
    videoGamePanelOpen = false;
    outsideGamePanelOpen = false;

    borrowInformations$: Observable<BorrowByComission[]>;


    constructor(public firebaseDatabaseService: FirebaseDatabaseService,
                private borrowDataService: BorrowDataService,
                private dialog: MatDialog) {
        this.borrowInformations$ = this.borrowDataService.getBorrowsOfComission(Comissions.LUDOTHEQUE);
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
