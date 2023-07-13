import {inject, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LudothequeComponent} from './ludotheque/components/ludotheque/ludotheque.component';
import {BibliothequeComponent} from './bibliotheque/components/bibliotheque/bibliotheque.component';
import {HomeComponent} from './common/components/home/home.component';
import {LibraryViewComponent} from './bibliotheque/components/library-view/library-view.component';
import {CategoryViewComponent} from './bibliotheque/components/category-view/category-view.component';
import {SeriesViewComponent} from './bibliotheque/components/series-view/series-view.component';
import {NewViewComponent} from './bibliotheque/components/new-view/new-view.component';
import {BoardGamesComponent} from './ludotheque/components/board-games/board-games.component';
import {VideoGamesComponent} from './ludotheque/components/video-games/video-games.component';
import {SettingsViewComponent} from './bibliotheque/components/settings-view/settings-view.component';
import {GameComponent} from './ludotheque/components/outside-games/game.component';
import {AdminHomeComponent} from './admin/components/admin-home/admin-home.component';
import {
  VideoGamesToFilterComponent
} from './ludotheque/components/video-games/video-games-to-filter/video-games-to-filter.component';
import {
  BoardGameToFilterComponent
} from './ludotheque/components/board-games/components/board-game-to-filter/board-game-to-filter.component';
import {AdminGamesComponent} from './admin/components/admin-ludo/admin-games/admin-games.component';
import {UserService} from './services/firebase/user.service';
import {AuthentificationService} from './services/firebase/authentification.service';
import {LudoNewComponent} from './ludotheque/components/ludo-new/ludo-new.component';
import {BricolageHomeComponent} from './bricolage/components/bricolage-home/bricolage-home.component';
import {BricoCategoryComponent} from './bricolage/components/brico-category/brico-category.component';
import {AdminBricolageComponent} from './admin/components/admin-bricolage/admin-bricolage.component';
import {EmpruntsHomeComponent} from "./admin/components/emprunts/emprunts-home/emprunts-home.component";
import {FirebaseDatabaseService} from "./services/firebase/firebase-database.service";
import {BricolageDatabaseService} from "./bricolage/services/bricolage-database.service";
import {SonoHomeComponent} from "./sonotheque/components/sono-home/sono-home.component";
import {SonoDatabaseService} from "./sonotheque/services/sono-database.service";
import {AdminSonothequeComponent} from "./admin/components/admin-sonotheque/admin-sonotheque.component";
import {SonoCategoryComponent} from "./sonotheque/components/sono-category/sono-category.component";
import {NautismeHomeComponent} from "./nautisme/components/nautisme-home/nautisme-home.component";
import {MaterielPhotoHomeComponent} from './photo/components/materiel-photo-home/materiel-photo-home.component';
import {
  MaterielPhotoCategoryComponent
} from './photo/components/materiel-photo-category/materiel-photo-category.component';
import {AdminNautismeComponent} from './admin/components/admin-nautisme/admin-nautisme.component';

const ludoRoutes: Routes = [
  {path: 'ludotheque', component: LudothequeComponent},
  {path: 'ludotheque/outsideGames', component: GameComponent},
  {path: 'ludotheque/outsideGames/:id', component: GameComponent},
  {path: 'ludotheque/videoGames', component: VideoGamesComponent},
  {path: 'ludotheque/videoGames/:categoryId', component: VideoGamesToFilterComponent},
  {path: 'ludotheque/videoGames/:categoryId/:id', component: VideoGamesToFilterComponent},
  {path: 'ludotheque/boardGames', component: BoardGamesComponent},
  {path: 'ludotheque/boardGames/:categoryId', component: BoardGameToFilterComponent},
  {path: 'ludotheque/boardGames/:categoryId/:id', component: BoardGameToFilterComponent},
  {path: 'ludotheque/new', component: LudoNewComponent},
];

const biblioRoutes: Routes = [
  {path: 'bibliotheque', component: BibliothequeComponent},
  {path: 'bibliotheque/new', component: NewViewComponent},
  {path: 'bibliotheque/:libraryId', component: LibraryViewComponent},
  {path: 'bibliotheque/:libraryId/:catId', component: CategoryViewComponent},
  {path: 'bibliotheque/:libraryId/:catId/:seriesId', component: SeriesViewComponent},
];

const bricoRoutes: Routes = [
  {path: 'bricolage', component: BricolageHomeComponent},
  {path: 'bricolage/:categoryId', component: BricoCategoryComponent},
  {path: 'bricolage/:categoryId/:id', component: BricoCategoryComponent},
];

const sonoRoutes: Routes = [
  {path: 'sonotheque', component: SonoHomeComponent},
  {path: 'sonotheque/:categoryId', component: SonoCategoryComponent},
];

const nautismeRoutes: Routes = [
  {path: 'nautisme', component: NautismeHomeComponent},
];

const materielPhotoRoutes: Routes = [
  {path: 'photo', component: MaterielPhotoHomeComponent},
  {path: 'photo/:categoryId', component: MaterielPhotoCategoryComponent},
];

const adminRoutes: Routes = [
  {
    path: 'iWantToConfigureThisAwesomeApp', component: AdminHomeComponent
  },
  {
    path: 'admin/emprunts', component: EmpruntsHomeComponent,
    canActivate: [() => inject(AuthentificationService).userIsAdmin$],
    resolve: {
      'users': () => inject(UserService).userList$,
      'ludotheque': () => inject(FirebaseDatabaseService).ludotheque$,
      // todo bilbiotheque quand JY a refondu le bordel
      'allTools': () => inject(BricolageDatabaseService).allTools$,
      'sonoItems': () => inject(SonoDatabaseService).allItems$,
    }
  },
  {
    path: 'ludotheque/admin/games', component: AdminGamesComponent,
    canActivate: [() => inject(AuthentificationService).userIsAdmin$ || inject(AuthentificationService).userIsLudoAdmin$]
  },
  {
    path: 'bricolage/admin/tools', component: AdminBricolageComponent,
    canActivate: [() => inject(AuthentificationService).userIsAdmin$ || inject(AuthentificationService).userIsBricolageAdmin$]
  },
  {
    path: 'sonotheque/admin/sonoItems', component: AdminSonothequeComponent,
    canActivate: [() => inject(AuthentificationService).userIsAdmin$ || inject(AuthentificationService).userIsSonoAdmin$]
  },
  {
    path: 'nautisme/admin/nautismeItems', component: AdminNautismeComponent,
    canActivate: [() => inject(AuthentificationService).userIsAdmin$ || inject(AuthentificationService).userIsNautismeAdmin$]
  },
  {
    path: 'bibliotheque/admin/:libraryId', component: SettingsViewComponent,
    canActivate: [() => inject(AuthentificationService).userIsAdmin$],
  },
];

const routes: Routes = [
  ...adminRoutes,
  ...ludoRoutes,
  ...biblioRoutes,
  ...bricoRoutes,
  ...sonoRoutes,
  ...nautismeRoutes,
  ...materielPhotoRoutes,
  {path: '', component: HomeComponent},
  {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
