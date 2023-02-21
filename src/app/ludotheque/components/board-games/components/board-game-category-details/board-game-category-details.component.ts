import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, Observable, take} from 'rxjs';
import {BoardGame} from '../../../../../models/boardGame.model';
import {FirebaseDatabaseService} from '../../../../../services/firebase-database.service';

@Component({
  selector: 'app-board-game-category-details',
  templateUrl: './board-game-category-details.component.html',
  styleUrls: ['./board-game-category-details.component.scss']
})
export class BoardGameCategoryDetailsComponent implements OnInit, AfterViewInit {

  boardGames$?: Observable<Array<BoardGame>>;
  public selectedBoardGameId?: string;
  public categoryId?: string;

  constructor(private route: ActivatedRoute,
              private firebaseDatabaseService: FirebaseDatabaseService) {
  }

  ngOnInit(): void {
    this.route.data.pipe(
      take(1),
      map((datas) => {
          this.selectedBoardGameId = datas['boardGamesCategoryDatas']['selectedId'];
          this.categoryId = datas['boardGamesCategoryDatas']['categoryId'];
          this.boardGames$ = this.firebaseDatabaseService.boardGamesNotifyChanges$.pipe(
            map((boardGames) => boardGames.filter(bg => bg.category === this.categoryId))
          );
        }
      )).subscribe();
  }

  ngAfterViewInit() {
  }

  trackBoardGame(index: number, item: BoardGame) {
    return item.id + item.name;
  }
}
