import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, Observable, Subscription} from 'rxjs';
import {FirebaseDatabaseService} from '../../../../../services/firebase/firebase-database.service';
import {NavigationService} from '../../../../../services/navigation.service';
import {BoardGame, BoardGameCategory} from '../../../../../models/boardGame.model';

@Component({
  selector: 'app-board-game-to-filter',
  templateUrl: './board-game-to-filter.component.html',
  styleUrls: ['./board-game-to-filter.component.scss']
})
export class BoardGameToFilterComponent implements OnInit, OnDestroy {

  boardGames$?: Observable<Array<BoardGame>>;
  selectedBoardGameId?: string;
  categoryId?: BoardGameCategory;
  private sub?: Subscription;

  constructor(private firebaseDb: FirebaseDatabaseService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
    this.sub = this.navigationService.getRouteParams().subscribe((params) => {
      if (this.categoryId !== params['categoryId']) {
        this.boardGames$ = this.firebaseDb.boardGames$.pipe(
          map((boardGames) => boardGames.filter(bg => bg.category === params['categoryId']))
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
