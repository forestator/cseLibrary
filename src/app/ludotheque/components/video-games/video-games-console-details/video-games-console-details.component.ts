import {Component, OnInit} from '@angular/core';
import {map, Observable} from 'rxjs';
import {Params} from '@angular/router';
import {NavigationService} from '../../../../services/navigation.service';
import {DataService} from '../../../../services/data.service';
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
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.videoGamesOfConsole$ = this.navService.getRouteParams().pipe(
      map((params: Params) => {
          const cat = this.dataService.getVideoGamesOfCategory(params['categoryId']);
          this.selectedVideoGameId = params['id'];
          return cat;
        }
      ));
  }

  trackVideoGame(index: number, item: VideoGame) {
    return item.ref;
  }
}
