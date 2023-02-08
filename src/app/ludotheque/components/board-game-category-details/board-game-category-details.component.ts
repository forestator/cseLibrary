import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {LudoGame} from '../../../models/boardGame.model';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {map, Observable} from 'rxjs';
import {DataService} from '../../../services/data.service';

@Component({
    selector: 'app-board-game-category-details',
    templateUrl: './board-game-category-details.component.html',
    styleUrls: ['./board-game-category-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardGameCategoryDetailsComponent implements OnInit {

    // @ts-ignore
    boardGames$: Observable<Array<LudoGame>> = [];

    constructor(private router: Router,
                private route: ActivatedRoute,
                private dataService: DataService) {
    }

    ngOnInit(): void {
        this.boardGames$ = this.route.paramMap.pipe(
            map((params: ParamMap) =>
                this.dataService.getGamesOfCategory(params.get('id')!))
        );
    }

    trackBoardGame(index: number, item: LudoGame) {
        return item.id + item.name;
    }
}
