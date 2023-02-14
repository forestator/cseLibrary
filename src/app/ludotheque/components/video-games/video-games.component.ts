import {Component} from '@angular/core';
import {Library} from '../../../models/author.model';
import videoGames from '../../../../assets/ludo/videoGamesLib.json';

@Component({
  selector: 'app-video-games',
  templateUrl: './video-games.component.html',
  styleUrls: ['./video-games.component.scss']
})
export class VideoGamesComponent {

  library: Library = videoGames.library as Library;

  constructor() { }
}
