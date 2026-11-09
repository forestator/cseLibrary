import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Library} from '../../../models/author.model';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {Game} from '../../../models/common.model';
import {NavigationService} from '../../../services/navigation.service';
import { GameRowComponent } from './game-row/game-row.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-games-list',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [GameRowComponent, AsyncPipe]
})
export class GameComponent implements OnInit, OnDestroy {
  private firebaseDb = inject(FirebaseDatabaseService);
  private navigationService = inject(NavigationService);

  library$: Observable<Library | null> = this.firebaseDb.outsideGamesLibrary$;
  games$: Observable<Array<Game> | null> = this.firebaseDb.outsideGames$;

  private sub?: Subscription;
  public selectedOutsideGame?: string;

  ngOnInit() {
    this.sub = this.navigationService.getRouteParams().subscribe((params) => {
      this.selectedOutsideGame = params['id'];
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
