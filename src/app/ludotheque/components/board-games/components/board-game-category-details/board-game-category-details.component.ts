import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {map, Observable} from 'rxjs';
import {DataService} from '../../../../../services/data.service';
import {BoardGame} from '../../../../../models/boardGame.model';

@Component({
  selector: 'app-board-game-category-details',
  templateUrl: './board-game-category-details.component.html',
  styleUrls: ['./board-game-category-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardGameCategoryDetailsComponent implements OnInit {

  // @ts-ignore
  boardGames$: Observable<Array<BoardGame>> = [];
  public selectedBoardGameId?: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.boardGames$ = this.route.paramMap.pipe(
      map((params: ParamMap) => {
          const boardGames: Array<BoardGame> = this.dataService.getGamesOfCategory(params.get('categoryId')!);
          this.selectedBoardGameId = params.get('id')!;
          return boardGames;
        }
      ));
  }

  trackBoardGame(index: number, item: BoardGame) {
    return item.id + item.name;
  }
}
