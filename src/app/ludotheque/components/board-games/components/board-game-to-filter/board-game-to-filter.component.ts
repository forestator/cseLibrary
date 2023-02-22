import {Component, OnInit} from '@angular/core';
import {map, Observable, take} from 'rxjs';
import {FirebaseDatabaseService} from '../../../../../services/firebase-database.service';
import {NavigationService} from '../../../../../services/navigation.service';
import {BoardGame, BoardGameCategory} from '../../../../../models/boardGame.model';

@Component({
  selector: 'app-board-game-to-filter',
  templateUrl: './board-game-to-filter.component.html',
  styleUrls: ['./board-game-to-filter.component.scss']
})
export class BoardGameToFilterComponent implements OnInit {

  boardGames$: Observable<Array<BoardGame>> = this.firebaseDb.boardGames$.pipe(
    map((boardGames) => boardGames.filter(bg => bg.category === this.categoryId))
  );
  selectedBoardGameId?: string;
  categoryId?: BoardGameCategory;

  constructor(private firebaseDb: FirebaseDatabaseService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
    this.navigationService.getRouteParams().pipe(take(1)).subscribe((params) => {
      this.selectedBoardGameId = params['id'];
      this.categoryId = params['categoryId'];
    });
  }
}
