import {Component} from '@angular/core';
import {Library} from '../../../models/author.model';
import outsideGames from '../../../../assets/ludo/outsideGamesLib.json';

@Component({
  selector: 'app-outside-games',
  templateUrl: './outside-games.component.html',
  styleUrls: ['./outside-games.component.scss']
})
export class OutsideGamesComponent {

  library: Library = outsideGames.library as Library;
  constructor() { }

}
