import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import {map, Observable, Subscription} from 'rxjs';
import {FirebaseDatabaseService} from '../../../../../services/firebase/firebase-database.service';
import {NavigationService} from '../../../../../services/navigation.service';
import {BoardGame, BoardGameCategory} from '../../../../../models/boardGame.model';
import { BoardGameCategoryDetailsComponent } from '../board-game-category-details/board-game-category-details.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-board-game-to-filter',
    templateUrl: './board-game-to-filter.component.html',
    styleUrls: ['./board-game-to-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [BoardGameCategoryDetailsComponent, AsyncPipe]
})
export class BoardGameToFilterComponent implements OnInit, OnDestroy {
  private firebaseDb = inject(FirebaseDatabaseService);
  private navigationService = inject(NavigationService);


  boardGames$?: Observable<Array<BoardGame> | undefined>;
  selectedBoardGameId?: string;
  categoryId?: BoardGameCategory;
  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.navigationService.getRouteParams().subscribe((params) => {
      if (this.categoryId !== params['categoryId']) {
        this.boardGames$ = this.firebaseDb.boardGames$.pipe(
          map((boardGames) => boardGames?.filter(bg => bg.category === params['categoryId']))
        );
      }
      this.categoryId = params['categoryId'];
      this.selectedBoardGameId = params['id'];
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
