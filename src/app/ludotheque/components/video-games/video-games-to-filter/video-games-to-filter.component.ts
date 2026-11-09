import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import {FirebaseDatabaseService} from '../../../../services/firebase/firebase-database.service';
import {NavigationService} from '../../../../services/navigation.service';
import {map, Observable, Subscription} from 'rxjs';
import {Consoles, VideoGame} from '../../../../models/videoGames.model';
import { VideoGamesConsoleDetailsComponent } from '../video-games-console-details/video-games-console-details.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-video-games-to-filter',
    templateUrl: './video-games-to-filter.component.html',
    styleUrls: ['./video-games-to-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [VideoGamesConsoleDetailsComponent, AsyncPipe]
})
export class VideoGamesToFilterComponent implements OnInit, OnDestroy {
  private firebaseDb = inject(FirebaseDatabaseService);
  private navigationService = inject(NavigationService);


  videoGames$?: Observable<Array<VideoGame> | undefined>;
  selectedVideoGameId?: string;
  consoleId?: Consoles;
  private sub?: Subscription;

  ngOnInit() {
   this.sub = this.navigationService.getRouteParams().subscribe((params) => {
      if (params['categoryId'] !== this.consoleId) {
        this.videoGames$ = this.firebaseDb.videoGames$.pipe(
          map((videoGames) => videoGames?.filter(vg => vg.category === params['categoryId']))
        );
      }
      this.selectedVideoGameId = params['id'];
      this.consoleId = params['categoryId'];
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
