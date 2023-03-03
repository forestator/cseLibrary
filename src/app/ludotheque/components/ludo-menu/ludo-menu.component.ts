import {Component} from '@angular/core';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';

interface Menu {
  name: string;
  route: string;
}
@Component({
  selector: 'app-ludo-menu',
  templateUrl: './ludo-menu.component.html',
  styleUrls: ['./ludo-menu.component.scss']
})
export class LudoMenuComponent {
  menu: Array<Menu>;

  constructor(public firebaseDatabaseService: FirebaseDatabaseService) {
   this.menu = [
     {name: 'Jeux de société', route: 'ludotheque/boardGames'},
     {name: 'Jeux vidéos', route: 'ludotheque/videoGames'},
     {name: 'Grand Jeux', route: 'ludotheque/outsideGames'}
   ];
  }
}
