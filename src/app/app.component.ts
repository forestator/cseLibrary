import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ToolsService} from './services/biblio/tools.service';
import {NavigationService} from './services/navigation.service';
import {BoardGameCategory} from './models/boardGame.model';
import {Consoles} from './models/videoGames.model';
import {MatSidenavContent} from '@angular/material/sidenav';
import {Libraries} from './models/author.model';
import {BricoCategories, Tool} from './bricolage/models/bricolage.model';
import {Observable} from 'rxjs';
import {BricolageDatabaseService} from './bricolage/services/bricolage-database.service';
import {SonoCategory} from "./sonotheque/models/sono.model";
import {Comissions} from "./models/common.model";
import {PhotoCategory} from './photo/models/materiel-photo.model';


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
  showBricolageMenu?: boolean;
  showSonothequeMenu?: boolean;
  showPhotoMenu?: boolean;
  showAdmin?: boolean;
  public menu: ({ route: string; name: string, subList?: { route: string; name: string }[] })[];
  showBoardGameFilters = false;
  allTools$?: Observable<Tool[]>;


  constructor(
    private navigationService: NavigationService,
    private bricolageDatabaseService: BricolageDatabaseService,
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
    this.showLudothequeMenu = url.includes(Comissions.LUDOTHEQUE);
    this.showBibliothequeMenu = url.includes(Comissions.BIBLIOTHEQUE);
    this.showBricolageMenu = url.includes(Comissions.BRICOLAGE);
    this.showSonothequeMenu = url.includes(Comissions.SONOTHEQUE);
    this.showPhotoMenu = url.includes(Comissions.PHOTO);
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
    if (this.showSonothequeMenu) {
      this.menu = Object.values(SonoCategory).map(cat => {
        return {name: cat, route: `sonotheque/${cat}`};
      });
    }
    if (this.showPhotoMenu) {
      this.menu = Object.values(PhotoCategory).map(cat => {
        return {name: cat === PhotoCategory.APPAREIL_PHOTO ? 'Appareils photo' : cat, route: `photo/${cat}`};
      });
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

    if (this.showBricolageMenu) {
      if (!this.allTools$) {
        this.allTools$ = this.bricolageDatabaseService.allTools$;
      }
      this.menu = [
        {name: 'Machine à bois', route: `bricolage/${BricoCategories.MACHINE_BOIS}`},
        {name: 'Carrelage', route: `bricolage/${BricoCategories.MACONNERIE_CARRELAGE}`},
        {name: 'Perçage', route: `bricolage/${BricoCategories.PERCAGE}`},
        {name: 'Scies Cloches', route: `bricolage/${BricoCategories.SCIES_CLOCHES}`},
        {name: 'Jardinage', route: `bricolage/${BricoCategories.JARDINAGE}`},
        {name: 'Nettoyage', route: `bricolage/${BricoCategories.NETTOYAGE}`},
        {name: 'Peinture', route: `bricolage/${BricoCategories.PEINTURE_TAPISSERIE_MOQUETTE}`},
        {name: 'Mecanique', route: `bricolage/${BricoCategories.MECANIQUE}`},
        {name: 'Soudure', route: `bricolage/${BricoCategories.SOUDURE_PLOMBERIE}`},
        {name: 'Electronique', route: `bricolage/${BricoCategories.ELECTRONIQUE}`},
        {name: 'Remorques', route: `bricolage/${BricoCategories.REMORQUES}`},
        {name: 'Divers', route: `bricolage/${BricoCategories.DIVERS}`},
      ];
    }

    if (!this.showBibliothequeMenu && !this.showLudothequeMenu && !this.showAdmin && !this.showPhotoMenu
      && !this.showBricolageMenu && !this.showSonothequeMenu) {
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
