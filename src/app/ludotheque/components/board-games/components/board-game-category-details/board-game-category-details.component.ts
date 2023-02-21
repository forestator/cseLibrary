import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription, take} from 'rxjs';
import {BoardGame} from '../../../../../models/boardGame.model';
import {FirebaseDatabaseService} from '../../../../../services/firebase-database.service';
import {NavigationService} from '../../../../../services/navigation.service';

@Component({
  selector: 'app-board-game-category-details',
  templateUrl: './board-game-category-details.component.html',
  styleUrls: ['./board-game-category-details.component.scss']
})
export class BoardGameCategoryDetailsComponent implements OnInit, OnDestroy {

  boardGames: Array<BoardGame> = [];
  public selectedBoardGameId?: string;
  public categoryId?: string;
  private boardGameSub?: Subscription;

  constructor(private navService: NavigationService,
              private activatedRoute: ActivatedRoute,
              private firebaseDatabaseService: FirebaseDatabaseService) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe((datas) => {
      this.selectedBoardGameId = datas['boardGamesCategoryDatas']['selectedId'];
      this.categoryId = datas['boardGamesCategoryDatas']['categoryId'];
      this.boardGames = datas['boardGamesCategoryDatas']['boardGames'];
    });
    this.boardGameSub = this.firebaseDatabaseService.boardGames$.subscribe(boardGames => {
      this.boardGames = boardGames.filter(vg => vg.category === this.categoryId)
    });
  }

  ngOnDestroy() {
    this.boardGameSub?.unsubscribe();
  }

  trackBoardGame(index: number, item: BoardGame) {
    return item.id + item.name + item.status;
  }
}
