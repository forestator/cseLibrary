import {Component, OnInit} from '@angular/core';
import {Params} from '@angular/router';
import {map, mergeMap, Observable} from 'rxjs';
import {BoardGame} from '../../../../../models/boardGame.model';
import {FirebaseDatabaseService} from '../../../../../services/firebase-database.service';
import {NavigationService} from '../../../../../services/navigation.service';

@Component({
  selector: 'app-board-game-category-details',
  templateUrl: './board-game-category-details.component.html',
  styleUrls: ['./board-game-category-details.component.scss']
})
export class BoardGameCategoryDetailsComponent implements OnInit {

  boardGames$?: Observable<Array<BoardGame>>;
  public selectedBoardGameId?: string;
  public categoryId?: string;

  constructor(private navService: NavigationService,
              private firebaseDatabaseService: FirebaseDatabaseService) {
  }

  ngOnInit(): void {
    this.boardGames$ = this.navService.getRouteParams().pipe(
      mergeMap((params: Params) => {
          this.categoryId = params['categoryId'];
          this.selectedBoardGameId = params['id'];
          return this.firebaseDatabaseService.boardGamesNotifyChanges$.pipe(
            map((boardGames) => boardGames.filter(bg => bg.category === this.categoryId))
          )
        }
      ));
  }

  trackBoardGame(index: number, item: BoardGame) {
    return item.id + item.name;
  }
}
