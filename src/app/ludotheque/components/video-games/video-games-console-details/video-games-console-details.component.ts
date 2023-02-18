import {Component, OnInit} from '@angular/core';
import {map, Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../../services/navigation.service';
import {VideoGame, VideoGameType} from '../../../../models/videoGames.model';

@Component({
  selector: 'app-video-games-console-details',
  templateUrl: './video-games-console-details.component.html',
  styleUrls: ['./video-games-console-details.component.scss']
})
export class VideoGamesConsoleDetailsComponent implements OnInit {
  videoGamesOfConsole$?: Observable<Array<VideoGame>>;

  videoGameType = VideoGameType;
  selectedVideoGameId?: string;

  constructor(private navService: NavigationService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.videoGamesOfConsole$ = this.route.data.pipe(map((datas) => {
        this.selectedVideoGameId = datas['videoGamesCategoryDatas']['selectedId'];
        return datas['videoGamesCategoryDatas']['videoGames'];
      }
    ));
  }

  trackVideoGame(index: number, item: VideoGame) {
    return item.ref;
  }
}
