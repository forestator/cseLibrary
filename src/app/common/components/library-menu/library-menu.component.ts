import {Component, OnInit} from '@angular/core';
import {Category, Library, ViewMode} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/data.service';
import {ToolsService} from 'src/app/services/tools.service';
import videoGamCats from '../../../../assets/ludo/videoGamesLib.json';
import {filter, map, Observable, of} from 'rxjs';
import {NavigationService} from '../../../services/navigation.service';
import {FirebaseDatabaseService} from '../../../services/firebase-database.service';

@Component({
  selector: 'app-library-menu',
  templateUrl: './library-menu.component.html',
  styleUrls: ['./library-menu.component.scss']
})
export class LibraryMenuComponent implements OnInit {

  menu$?: Observable<any>;
  title: string = 'Cse';
  prefixRoute: string = '';
  selectedMenu$: Observable<{ name: string; route: string; categories?: Array<Category> }> | undefined;

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
      this.prefixRoute = 'bibliotheque/';
      this.menu$ = of(this.dataService.allBiblio.map((item) => {
        return {
          name: item.library!.name,
          route: this.prefixRoute + item.library!.id!,
          categories: item.library!.categories};
      }));
      // todo
      //this.setCategories(url, this.menu);
    } else if (url.includes('ludotheque/j2s')) {
      this.prefixRoute = 'ludotheque/j2s/';
      this.menu$ = this.firebaseDatabaseService.boardGamesLibrary$?.pipe(map(library => {
        return library?.categories?.map(cat => {
          return {name: cat.name, route: this.prefixRoute + cat.id};
        });
      }));
    } else if (url.includes('ludotheque/videoGames')) {
      this.prefixRoute = 'ludotheque/videoGames/';
      this.menu$ = of(videoGamCats.library.categories.map(cat => {
        return {name: cat.name, route: this.prefixRoute + cat.id};
      }));
    } else if (url.includes('ludotheque')) {
      this.prefixRoute = '/ludotheque';
    } else {
      this.menu$ = of([]);
      this.prefixRoute = '/';
    }
  }

  // private setCategories(url: string, menu: Observable<Array<{ name: string; route: string; categories?: Array<Category> }>>) {
  //   this.selectedMenu$ = menu.pipe(filter((menus) => menus.find(men => url.includes(men.route.slice(13))));
  // }
}
