import { AfterViewInit, Component, OnInit, ChangeDetectionStrategy, inject, viewChild } from '@angular/core';
import {ToolsService} from './services/biblio/tools.service';
import {NavigationService} from './services/navigation.service';
import {BoardGameCategory} from './models/boardGame.model';
import {Consoles} from './models/videoGames.model';
import { MatSidenavContent, MatSidenavContainer, MatSidenav } from '@angular/material/sidenav';
import {Libraries} from './models/author.model';
import {BricoCategories, PhotoCategory, SonoCategory} from './catalogue/models/catalogue-categories';
import {Comissions} from "./models/common.model";
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatList, MatListItem, MatListItemTitle, MatDivider } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { LibraryMenuComponent } from './bibliotheque/components/library-menu/library-menu.component';
import { AsyncPipe } from '@angular/common';
import { FilterBoardGamesComponent } from './ludotheque/components/board-games/components/filter-board-games/filter-board-games.component';
import { LudoMenuComponent } from './ludotheque/components/ludo-menu/ludo-menu.component';
import { CatalogueMenu } from './catalogue/components/catalogue-menu/catalogue-menu';
import { AdminMenuComponent } from './admin/components/admin-menu/admin-menu.component';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FilterBoardGamesComponent, LudoMenuComponent, CatalogueMenu, AdminMenuComponent, MatSidenavContainer, MatSidenav, RouterLink, MatList, MatListItem, MatListItemTitle, MatDivider, MatIcon, MatSidenavContent, MatToolbar, MatIconButton, LibraryMenuComponent, RouterOutlet, AsyncPipe]
})
export class AppComponent implements OnInit, AfterViewInit {
  private navigationService = inject(NavigationService);
  toolService = inject(ToolsService);

  readonly topMenu = viewChild<MatSidenavContent>('top');
  readonly drawer = viewChild<any>('drawer');
  title = 'Cse';
  showLudothequeMenu?: boolean;
  showBibliothequeMenu?: boolean;
  showHomeMenu?: boolean;
  showBricolageMenu?: boolean;
  showSonothequeMenu?: boolean;
  showPhotoMenu?: boolean;
  showAdmin?: boolean;
  public menu: ({ route: string; name: string, subList?: { route: string; name: string }[] })[];
  showBoardGameFilters = false;
  protected readonly bricolage = Comissions.BRICOLAGE;

  ngOnInit() {
    this.navigationService.url$.subscribe(url => {
      this.closeSideNav();
      this.handleUrlChange(url);
    });
  }

  closeSideNav() {
    const drawer = this.drawer();
    if (drawer?._mode == 'over') {
      drawer.close();
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

    if (url.includes(Comissions.NAUTISME)) {
      this.menu = [];
    } else if (this.showLudothequeMenu) {
      this.menu = [
        {
          name: 'Jeux de société', route: 'ludotheque/boardGames',
          subList: Object.values(BoardGameCategory).map(cat => {
            return {name: cat.toString(), route: `ludotheque/boardGames/${cat}`};
          })
        },
        {
          name: 'Jeux vidéos', route: 'ludotheque/videoGames',
          subList: Object.values(Consoles).map(cat => {
            return {name: cat.toString(), route: `ludotheque/videoGames/${cat}`};
          })
        },
        {name: 'Grand Jeux', route: 'ludotheque/outsideGames'},
        {name: 'Nouveautés ludo', route: 'ludotheque/new'},
      ];
    } else if (this.showSonothequeMenu) {
      this.menu = Object.values(SonoCategory).map(cat => {
        return {name: cat.toString(), route: `sonotheque/${cat}`};
      });
    } else if (this.showPhotoMenu) {
      this.menu = Object.values(PhotoCategory).map(cat => {
        return {name: cat === PhotoCategory.APPAREIL_PHOTO ? 'Appareils photo' : cat.toString(), route: `photo/${cat}`};
      });
    } else if (this.showBibliothequeMenu) {
      this.menu = [
        {name: 'Imaginaire', route: `bibliotheque/${Libraries.IMAGINAIRE}`},
        {name: 'Inclassable', route: `bibliotheque/${Libraries.INCLASSABLE}`},
        {name: 'Jeunesse', route: `bibliotheque/${Libraries.LIBRAIRIE_JEUNESSE}`},
        {name: 'Adultes', route: `bibliotheque/${Libraries.LITTERATURE_ADULTE}`},
        {name: 'Nouveautés', route: `bibliotheque/new`},
      ];
    } else if (this.showBricolageMenu) {
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
    } else {
      this.menu = Object.values(Comissions).map((com) => ({name: com.toString(), route: com.toString()}));
    }
  }

  ngAfterViewInit() {
    this.toolService.mobilePhoneDisplay$.next(this.topMenu().getElementRef().nativeElement.offsetWidth < 400);
  }

  scrollToTop() {
    this.toolService.scrollToId('top');
  }
}
