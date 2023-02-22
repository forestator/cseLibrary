import {Component, OnDestroy, OnInit} from '@angular/core';
import {FirebaseDatabaseService} from '../../../../services/firebase-database.service';
import {NavigationService} from '../../../../services/navigation.service';
import {map, Observable, Subscription} from 'rxjs';
import {Consoles, VideoGame} from '../../../../models/videoGames.model';

@Component({
  selector: 'app-video-games-to-filter',
  templateUrl: './video-games-to-filter.component.html',
  styleUrls: ['./video-games-to-filter.component.scss']
})
export class VideoGamesToFilterComponent implements OnInit, OnDestroy {

  videoGames$?: Observable<Array<VideoGame>>;
  selectedVideoGameId?: string;
  consoleId?: Consoles;
  private sub?: Subscription;

  constructor(private firebaseDb: FirebaseDatabaseService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
   this.sub = this.navigationService.getRouteParams().subscribe((params) => {
      if (params['categoryId'] !== this.consoleId) {
        this.videoGames$ = this.firebaseDb.videoGames$.pipe(
          map((videoGames) => videoGames.filter(vg => vg.category === params['categoryId']))
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
