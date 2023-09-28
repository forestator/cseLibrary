import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Library} from '../../../models/author.model';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {Comissions, Game} from '../../../models/common.model';
import {NavigationService} from '../../../services/navigation.service';
import {BorrowByComission} from '../../../admin/models/borrow.model';
import {BorrowDataService} from '../../../admin/services/borrow-data.service';

@Component({
  selector: 'app-games-list',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  library$: Observable<Library | null> = this.firebaseDb.outsideGamesLibrary$;
  games$: Observable<Array<Game> | null> = this.firebaseDb.outsideGames$;

  ludoBorrowInformations$: Observable<BorrowByComission[]>;
  private sub?: Subscription;
  public selectedOutsideGame?: string;

  constructor(private firebaseDb: FirebaseDatabaseService,
              private borrowDataService: BorrowDataService,
              private navigationService: NavigationService) {
    this.ludoBorrowInformations$ = this.borrowDataService.getBorrowsOfComission(Comissions.LUDOTHEQUE);
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
