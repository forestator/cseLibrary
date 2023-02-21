import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LudothequeComponent} from './ludotheque/components/ludotheque/ludotheque.component';
import {
  BoardGameCategoryDetailsComponent
} from './ludotheque/components/board-games/components/board-game-category-details/board-game-category-details.component';
import {BibliothequeComponent} from './bibliotheque/components/bibliotheque/bibliotheque.component';
import {HomeComponent} from './common/components/home/home.component';
import {LibraryViewComponent} from './bibliotheque/components/library-view/library-view.component';
import {CategoryViewComponent} from './bibliotheque/components/category-view/category-view.component';
import {SeriesViewComponent} from './bibliotheque/components/series-view/series-view.component';
import {NewViewComponent} from './bibliotheque/components/new-view/new-view.component';
import {BoardGamesComponent} from './ludotheque/components/board-games/board-games.component';
import {VideoGamesComponent} from './ludotheque/components/video-games/video-games.component';
import {
  VideoGamesConsoleDetailsComponent
} from './ludotheque/components/video-games/video-games-console-details/video-games-console-details.component';
import {SettingsViewComponent} from './bibliotheque/components/settings-view/settings-view.component';
import {GamesOfConcolesResolver} from './resolvers/games-of-concoles.resolver';
import {OutsideGamesComponent} from './ludotheque/components/outside-games/outside-games.component';
import {AdminHomeComponent} from './admin/components/admin-home/admin-home.component';

const ludoRoutes: Routes = [
  {path: 'ludotheque', component: LudothequeComponent},
  {path: 'ludotheque/outsideGames', component: OutsideGamesComponent},
  {path: 'ludotheque/videoGames', component: VideoGamesComponent},
  {
    path: 'ludotheque/videoGames/:categoryId', component: VideoGamesConsoleDetailsComponent,
    resolve: {videoGamesCategoryDatas: GamesOfConcolesResolver}
  },
  {
    path: 'ludotheque/videoGames/:categoryId/:id', component: VideoGamesConsoleDetailsComponent,
    resolve: {videoGamesCategoryDatas: GamesOfConcolesResolver}
  },
  {path: 'ludotheque/j2s', component: BoardGamesComponent},
  {path: 'ludotheque/j2s/:categoryId', component: BoardGameCategoryDetailsComponent},
  {path: 'ludotheque/j2s/:categoryId/:id', component: BoardGameCategoryDetailsComponent},
  {path: 'ludotheque/new', component: NewViewComponent}
];

const biblioRoutes: Routes = [
  {path: 'bibliotheque', component: BibliothequeComponent},
  {path: 'bibliotheque/new', component: NewViewComponent},
  {path: 'bibliotheque/:libraryId', component: LibraryViewComponent},
  {path: 'bibliotheque/:libraryId/:catId', component: CategoryViewComponent},
  {path: 'bibliotheque/:libraryId/:catId/settings', component: SettingsViewComponent},
  {path: 'bibliotheque/:libraryId/:catId/:seriesId', component: SeriesViewComponent},
];

const routes: Routes = [
  ...ludoRoutes,
  ...biblioRoutes,
  {path: 'iWantToConfigureThisAwesomeApp', component: AdminHomeComponent},
  {path: '', component: HomeComponent},
  {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
