import {Component, OnInit} from '@angular/core';
import {FirebaseDatabaseService} from '../../../../services/firebase-database.service';
import {NavigationService} from '../../../../services/navigation.service';
import {map, Observable, take} from 'rxjs';
import {Consoles, VideoGame} from '../../../../models/videoGames.model';

@Component({
  selector: 'app-video-games-to-filter',
  templateUrl: './video-games-to-filter.component.html',
  styleUrls: ['./video-games-to-filter.component.scss']
})
export class VideoGamesToFilterComponent implements OnInit {

  videoGames$: Observable<Array<VideoGame>> = this.firebaseDb.videoGames$.pipe(
    map((videoGames) => videoGames.filter(vg => vg.category === this.consoleId))
  );
  selectedVideoGameId?: string;
  consoleId?: Consoles;

  constructor(private firebaseDb: FirebaseDatabaseService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
    this.navigationService.getRouteParams().pipe(take(1)).subscribe((params) => {
      this.selectedVideoGameId = params['id'];
      this.consoleId = params['categoryId'];
    });
  }
}
