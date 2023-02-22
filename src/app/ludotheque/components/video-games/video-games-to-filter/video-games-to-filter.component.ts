import {Component, OnInit} from '@angular/core';
import {FirebaseDatabaseService} from '../../../../services/firebase-database.service';
import {NavigationService} from '../../../../services/navigation.service';
import {map, Observable} from 'rxjs';
import {Consoles, VideoGame} from '../../../../models/videoGames.model';

@Component({
  selector: 'app-video-games-to-filter',
  templateUrl: './video-games-to-filter.component.html',
  styleUrls: ['./video-games-to-filter.component.scss']
})
export class VideoGamesToFilterComponent implements OnInit {

  videoGames$?: Observable<Array<VideoGame>>;
  selectedVideoGameId?: string;
  consoleId?: Consoles;

  constructor(private firebaseDb: FirebaseDatabaseService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
    this.navigationService.getRouteParams().subscribe((params) => {
      this.selectedVideoGameId = params['id'];
      this.consoleId = params['categoryId'];
      this.videoGames$ = this.firebaseDb.videoGames$.pipe(
        map((videoGames) => videoGames.filter(vg => vg.category === this.consoleId))
      );
    });
  }
}
