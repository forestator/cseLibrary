import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, Observable} from 'rxjs';
import {BoardGame} from '../../../../../models/boardGame.model';

@Component({
  selector: 'app-board-game-category-details',
  templateUrl: './board-game-category-details.component.html',
  styleUrls: ['./board-game-category-details.component.scss']
})
export class BoardGameCategoryDetailsComponent implements OnInit {

  boardGames$?: Observable<Array<BoardGame>>;
  public selectedBoardGameId?: string;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.boardGames$ = this.route.data.pipe(map((datas) => {
        this.selectedBoardGameId = datas['boardGamesCategoryDatas']['selectedId'];
        return datas['boardGamesCategoryDatas']['boardGames'];
      }
    ));
  }

  trackBoardGame(index: number, item: BoardGame) {
    return item.id + item.name;
  }
}
