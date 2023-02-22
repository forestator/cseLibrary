import {Component, OnInit} from '@angular/core';
import {Category, Library} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import {ToolsService} from 'src/app/services/biblio/tools.service';
import {map, Observable, of} from 'rxjs';
import {NavigationService} from '../../../services/navigation.service';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';

@Component({
  selector: 'app-library-menu',
  templateUrl: './library-menu.component.html',
  styleUrls: ['./library-menu.component.scss']
})
export class LibraryMenuComponent implements OnInit {

  title: string = 'Cse';
  prefixRoute: string = '';
  menu$?: Observable<Array<{ name: string; route: string; categories?: Array<Category> }> | undefined>;
  selectedMenu?: { name: string; route: string; categories?: Array<Category> } | null;

  constructor(public dataService: DataService,
              public firebaseDatabaseService: FirebaseDatabaseService,
              public navService: NavigationService,
              public tools: ToolsService) {
  }

  ngOnInit(): void {
    this.navService.url$.subscribe((url) => {
      this.handleUrlChange(url);
    });
  }

  public toggleAdminMode() {
    this.tools.adminMode = !this.tools.adminMode;
    this.tools.adminMode$.next(this.tools.adminMode);
    console.log('adminMode', this.tools.adminMode);
  }

  private handleUrlChange(url: string) {
    if (url.includes('bibliotheque')) {
      this.setInformationsForBibliotheque();
    } else if (url.includes('ludotheque/j2s')) {
      this.prefixRoute = 'ludotheque/j2s/';
      this.selectedMenu = null;
      this.menu$ = this.firebaseDatabaseService.boardGamesLibrary$.pipe(map(library => {
        return library?.categories?.map(cat => {
          return {name: cat.name, route: this.prefixRoute + cat.id};
        });
      }));
    } else if (url.includes('ludotheque/videoGames')) {
      this.prefixRoute = 'ludotheque/videoGames/';
      this.selectedMenu = null;
      this.menu$ = this.firebaseDatabaseService.videoGamesLibrary$.pipe(map(lib => {
        const categories = lib?.categories;
        return categories?.map((cat) => {
          return {name: cat.name, route: this.prefixRoute + cat.id};
        })
      }));
    } else if (url.includes('ludotheque')) {
      this.prefixRoute = '/ludotheque/';
      this.menu$ = of([
        {name: 'Jeux de société', route: 'ludotheque/j2s'},
        {name: 'Jeux vidéos', route: 'ludotheque/videoGames'},
        {name: 'Jeux de plein-air', route: 'ludotheque/outsideGames'}
      ]);
      this.selectedMenu = null;
    } else {
      this.menu$ = of([]);
      this.selectedMenu = null;
      this.prefixRoute = '/';
    }
  }

  private setInformationsForBibliotheque() {
    this.prefixRoute = 'bibliotheque/';
    this.menu$ = this.firebaseDatabaseService.bibliotheque$.pipe(map((item) => {
      const currentLib: Library | undefined
        = item?.find(biblio => biblio.library?.id === this.dataService.selectedLib?.library?.id)!.library;
      const menus = item?.map(biblio => {
        return {
          name: biblio.library!.name,
          route: this.prefixRoute + biblio.library!.id!,
          categories: biblio.library!.categories
        };
      });
      this.selectedMenu = menus?.find(menu => menu.name === currentLib?.name);
      return menus;
    }));
  }
}
