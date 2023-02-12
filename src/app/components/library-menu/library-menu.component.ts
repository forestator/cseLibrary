import {Component, OnInit} from '@angular/core';
import {Library, ViewMode} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/data.service';
import {ToolsService} from 'src/app/services/tools.service';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import boardGamCats from '../../../assets/ludo/boardGameLib.json'
import {Observable} from 'rxjs';

@Component({
  selector: 'app-library-menu',
  templateUrl: './library-menu.component.html',
  styleUrls: ['./library-menu.component.scss']
})
export class LibraryMenuComponent implements OnInit {

  public menu: Array<{ name: string, route: string }> = [];
  public VIEW_MODES = ViewMode;
  title: string = 'Cse';
  prefixRoute: string = '';
  library$!: Observable<Library | undefined>;

  constructor(public dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              public tools: ToolsService) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((route) => {
      if (route instanceof NavigationStart) {
        this.handleUrlChange(route.url);
      }
    });
  }

  public toggleAdminMode() {
    this.tools.adminMode = !this.tools.adminMode;
    console.log('adminMode', this.tools.adminMode);
  }

  private handleUrlChange(url: string) {
    if (url.includes('bibliotheque')) {
      this.menu = this.dataService.allBiblio.map((item) => {
        return {name: item.library!.name, route: item.library!.id!};
      });
      this.prefixRoute = 'bibliotheque/';
    } else if (url.includes('ludotheque')) {
      this.menu = boardGamCats.library.categories.map(cat => {
        return {name: cat.name, route: cat.id};
      });
      this.prefixRoute = 'ludotheque/';
    } else {
      this.menu = [];
      this.prefixRoute = '/';
    }
  }
}
