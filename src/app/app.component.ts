import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ToolsService} from './services/biblio/tools.service';
import {NavigationService} from './services/navigation.service';
import {BoardGameCategory} from './models/boardGame.model';
import {Consoles} from './models/videoGames.model';
import {MatSidenavContent} from '@angular/material/sidenav';
import {Libraries} from './models/author.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('top') topMenu: MatSidenavContent;
  @ViewChild('drawer') drawer: any;
  title = 'Cse';
  showLudothequeMenu?: boolean;
  showBibliothequeMenu?: boolean;
  showAdmin?: boolean;
  public menu: ({ route: string; name: string, subList?: { route: string; name: string }[] })[];
  showBoardGameFilters = false;


  constructor(
    private navigationService: NavigationService,
    public toolService: ToolsService) {
  }

  ngOnInit() {
    this.navigationService.url$.subscribe(url => {
      this.closeSideNav();
      this.handleUrlChange(url);
    });
  }

  closeSideNav() {
    if (this.drawer?._mode == 'over') {
      this.drawer.close();
    }
  }

  private handleUrlChange(url: string) {
    this.showLudothequeMenu = url.includes('ludotheque');
    this.showBibliothequeMenu = url.includes('bibliotheque');
    this.showAdmin = url.includes('admin');
    this.showBoardGameFilters = url.includes('boardGames/');

    if (this.showLudothequeMenu) {
      this.menu = [
        {
          name: 'Jeux de société', route: 'ludotheque/boardGames',
          subList: Object.values(BoardGameCategory).map(cat => {
            return {name: cat, route: `ludotheque/boardGames/${cat}`};
          })
        },
        {
          name: 'Jeux vidéos', route: 'ludotheque/videoGames',
          subList: Object.values(Consoles).map(cat => {
            return {name: cat, route: `ludotheque/videoGames/${cat}`};
          })
        },
        {name: 'Grand Jeux', route: 'ludotheque/outsideGames'},
        {name: 'Nouveautés ludo', route: 'ludotheque/new'},
      ];
    }

    if (this.showBibliothequeMenu) {
      this.menu = [
        {name: 'Imaginaire', route: `bibliotheque/${Libraries.IMAGINAIRE}`},
        {name: 'Inclassable', route: `bibliotheque/${Libraries.INCLASSABLE}`},
        {name: 'Jeunesse', route: `bibliotheque/${Libraries.LIBRAIRIE_JEUNESSE}`},
        {name: 'Adultes', route: `bibliotheque/${Libraries.LITTERATURE_ADULTE}`},
        {name: 'Nouveautés', route: `bibliotheque/new`},
      ];
    }

    if (!this.showBibliothequeMenu && !this.showLudothequeMenu && !this.showAdmin) {
      this.menu = [];
    }
  }

  ngAfterViewInit() {
    this.toolService.mobilePhoneDisplay$.next(this.topMenu.getElementRef().nativeElement.offsetWidth < 400);
  }

  scrollToTop() {
    this.toolService.scrollToId('top');
  }
}
