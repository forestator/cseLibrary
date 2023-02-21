import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, take} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../../services/navigation.service';
import {Consoles, VideoGame, VideoGameType} from '../../../../models/videoGames.model';
import {FirebaseDatabaseService} from '../../../../services/firebase-database.service';

@Component({
  selector: 'app-video-games-console-details',
  templateUrl: './video-games-console-details.component.html',
  styleUrls: ['./video-games-console-details.component.scss']
})
export class VideoGamesConsoleDetailsComponent implements OnInit, OnDestroy {
  videoGameType = VideoGameType;
  selectedVideoGameId?: string;
  consoleId?: Consoles;
  videoGames: Array<VideoGame> = [];
  private videoGamesSub?: Subscription;

  constructor(private navService: NavigationService,
              private activatedRoute: ActivatedRoute,
              private firebaseDatabaseService: FirebaseDatabaseService) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe((datas) => {
      this.selectedVideoGameId = datas['videoGamesCategoryDatas']['selectedId'];
      this.consoleId = datas['videoGamesCategoryDatas']['categoryId'];
      this.videoGames = datas['videoGamesCategoryDatas']['videoGames'];
    });
    this.videoGamesSub = this.firebaseDatabaseService.videoGames$.subscribe(videoGames => {
      this.videoGames = videoGames.filter(vg => vg.category === this.consoleId)
    });
  }

  ngOnDestroy() {
    this.videoGamesSub?.unsubscribe();
  }

  trackVideoGame(index: number, item: VideoGame) {
    return item.ref + item.status;
  }
}
