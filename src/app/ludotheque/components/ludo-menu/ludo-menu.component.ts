import {Component} from '@angular/core';
import {map, Observable} from 'rxjs';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {NavigationService} from '../../../services/navigation.service';

@Component({
  selector: 'app-ludo-menu',
  templateUrl: './ludo-menu.component.html',
  styleUrls: ['./ludo-menu.component.scss']
})
export class LudoMenuComponent {

  prefixRoute: string = 'ludotheque/';
  menu$?: Observable<Array<{name: string; route: string}> | undefined>;
  constructor(public firebaseDatabaseService: FirebaseDatabaseService,
              private nav: NavigationService) {
    this.nav.url$.subscribe(url => {
      if (url.includes('j2s')) {
        this.prefixRoute = 'ludotheque/j2s/';
        this.menu$ = this.firebaseDatabaseService.boardGamesLibrary$.pipe(map(library => {
          return library?.categories?.map(cat => {
            return {name: cat.name, route: this.prefixRoute + cat.id};
          });
        }));
      } else if (url.includes('videoGames')) {
        this.prefixRoute = 'ludotheque/videoGames/';
        this.menu$ = this.firebaseDatabaseService.videoGamesLibrary$.pipe(map(lib => {
          const categories = lib?.categories;
          return categories?.map((cat) => {
            return {name: cat.name, route: this.prefixRoute + cat.id};
          })
        }));
      }
    });
  }
}
