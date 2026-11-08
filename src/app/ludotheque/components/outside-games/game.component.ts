import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Library} from '../../../models/author.model';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {Game} from '../../../models/common.model';
import {NavigationService} from '../../../services/navigation.service';

@Component({
    selector: 'app-games-list',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
    standalone: false
})
export class GameComponent implements OnInit, OnDestroy {
  library$: Observable<Library | null> = this.firebaseDb.outsideGamesLibrary$;
  games$: Observable<Array<Game> | null> = this.firebaseDb.outsideGames$;

  private sub?: Subscription;
  public selectedOutsideGame?: string;

  constructor(private firebaseDb: FirebaseDatabaseService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
    this.sub = this.navigationService.getRouteParams().subscribe((params) => {
      this.selectedOutsideGame = params['id'];
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
