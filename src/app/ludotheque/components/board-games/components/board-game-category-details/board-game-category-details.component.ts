import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Params} from '@angular/router';
import {map, Observable} from 'rxjs';
import {DataService} from '../../../../../services/data.service';
import {BoardGame} from '../../../../../models/boardGame.model';
import {NavigationService} from '../../../../../services/navigation.service';

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

  constructor(private navService: NavigationService,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.boardGames$ = this.navService.getRouteParams().pipe(
      map((params: Params) => {
          const boardGames: Array<BoardGame> = this.dataService.getGamesOfCategory(params['categoryId']);
          this.selectedBoardGameId = params['id'];
          return boardGames;
        }
      ));
  }

  trackBoardGame(index: number, item: BoardGame) {
    return item.id + item.name;
  }
}
