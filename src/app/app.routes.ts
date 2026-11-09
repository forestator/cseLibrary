import {inject} from '@angular/core';
import {Routes} from '@angular/router';
import {AuthentificationService} from './services/firebase/authentification.service';

const ludoRoutes: Routes = [
    {path: 'ludotheque', loadComponent: () => import('./ludotheque/components/ludotheque/ludotheque.component').then(m => m.LudothequeComponent)},
    {path: 'ludotheque/outsideGames', loadComponent: () => import('./ludotheque/components/outside-games/game.component').then(m => m.GameComponent)},
    {path: 'ludotheque/outsideGames/:id', loadComponent: () => import('./ludotheque/components/outside-games/game.component').then(m => m.GameComponent)},
    {path: 'ludotheque/videoGames', loadComponent: () => import('./ludotheque/components/video-games/video-games.component').then(m => m.VideoGamesComponent)},
    {path: 'ludotheque/videoGames/:categoryId', loadComponent: () => import('./ludotheque/components/video-games/video-games-to-filter/video-games-to-filter.component').then(m => m.VideoGamesToFilterComponent)},
    {path: 'ludotheque/videoGames/:categoryId/:id', loadComponent: () => import('./ludotheque/components/video-games/video-games-to-filter/video-games-to-filter.component').then(m => m.VideoGamesToFilterComponent)},
    {path: 'ludotheque/boardGames', loadComponent: () => import('./ludotheque/components/board-games/board-games.component').then(m => m.BoardGamesComponent)},
    {path: 'ludotheque/boardGames/:categoryId', loadComponent: () => import('./ludotheque/components/board-games/components/board-game-to-filter/board-game-to-filter.component').then(m => m.BoardGameToFilterComponent)},
    {path: 'ludotheque/boardGames/:categoryId/:id', loadComponent: () => import('./ludotheque/components/board-games/components/board-game-to-filter/board-game-to-filter.component').then(m => m.BoardGameToFilterComponent)},
    {path: 'ludotheque/new', loadComponent: () => import('./ludotheque/components/ludo-new/ludo-new.component').then(m => m.LudoNewComponent)},
];

const biblioRoutes: Routes = [
    {path: 'bibliotheque', loadComponent: () => import('./bibliotheque/components/bibliotheque/bibliotheque.component').then(m => m.BibliothequeComponent)},
    {path: 'bibliotheque/new', loadComponent: () => import('./bibliotheque/components/new-view/new-view.component').then(m => m.NewViewComponent)},
    {path: 'bibliotheque/:libraryId', loadComponent: () => import('./bibliotheque/components/library-view/library-view.component').then(m => m.LibraryViewComponent)},
    {path: 'bibliotheque/:libraryId/:catId', loadComponent: () => import('./bibliotheque/components/category-view/category-view.component').then(m => m.CategoryViewComponent)},
    {path: 'bibliotheque/:libraryId/:catId/:seriesId', loadComponent: () => import('./bibliotheque/components/series-view/series-view.component').then(m => m.SeriesViewComponent)},
];

const bricoRoutes: Routes = [
    {path: 'bricolage', loadComponent: () => import('./bricolage/components/bricolage-home/bricolage-home.component').then(m => m.BricolageHomeComponent)},
    {path: 'bricolage/:categoryId', loadComponent: () => import('./bricolage/components/brico-category/brico-category.component').then(m => m.BricoCategoryComponent)},
    {path: 'bricolage/:categoryId/:id', loadComponent: () => import('./bricolage/components/brico-category/brico-category.component').then(m => m.BricoCategoryComponent)},
];

const sonoRoutes: Routes = [
    {path: 'sonotheque', loadComponent: () => import('./sonotheque/components/sono-home/sono-home.component').then(m => m.SonoHomeComponent)},
    {path: 'sonotheque/:categoryId', loadComponent: () => import('./sonotheque/components/sono-category/sono-category.component').then(m => m.SonoCategoryComponent)},
];

const nautismeRoutes: Routes = [
    {path: 'nautisme', loadComponent: () => import('./nautisme/components/nautisme-home/nautisme-home.component').then(m => m.NautismeHomeComponent)},
];

const materielPhotoRoutes: Routes = [
    {path: 'photo', loadComponent: () => import('./photo/components/materiel-photo-home/materiel-photo-home.component').then(m => m.MaterielPhotoHomeComponent)},
    {path: 'photo/:categoryId', loadComponent: () => import('./photo/components/materiel-photo-category/materiel-photo-category.component').then(m => m.MaterielPhotoCategoryComponent)},
];

const adminRoutes: Routes = [
    {
        path: 'iWantToConfigureThisAwesomeApp', loadComponent: () => import('./admin/components/admin-home/admin-home.component').then(m => m.AdminHomeComponent)
    },
    {
        path: 'ludotheque/admin/games', loadComponent: () => import('./admin/components/admin-ludo/admin-games/admin-games.component').then(m => m.AdminGamesComponent),
        canActivate: [() => inject(AuthentificationService).isUserLudoAdmin$]
    },
    {
        path: 'bricolage/admin/tools', loadComponent: () => import('./admin/components/admin-bricolage/admin-bricolage.component').then(m => m.AdminBricolageComponent),
        canActivate: [() => inject(AuthentificationService).isUserBricolageAdmin$]
    },
    {
        path: 'sonotheque/admin/sonoItems', loadComponent: () => import('./admin/components/admin-sonotheque/admin-sonotheque.component').then(m => m.AdminSonothequeComponent),
        canActivate: [() => inject(AuthentificationService).isUserSonoAdmin$]
    },
    {
        path: 'nautisme/admin/nautismeItems', loadComponent: () => import('./admin/components/admin-nautisme/admin-nautisme.component').then(m => m.AdminNautismeComponent),
        canActivate: [() => inject(AuthentificationService).isUserNautismeAdmin$]
    },
    {
        path: 'bibliotheque/admin/:libraryId', loadComponent: () => import('./bibliotheque/components/settings-view/settings-view.component').then(m => m.SettingsViewComponent),
        canActivate: [() => inject(AuthentificationService).isUserSuperAdmin],
    },
];

export const routes: Routes = [
    ...adminRoutes,
    ...ludoRoutes,
    ...biblioRoutes,
    ...bricoRoutes,
    ...sonoRoutes,
    ...nautismeRoutes,
    ...materielPhotoRoutes,
    {path: '', loadComponent: () => import('./common/components/home/home.component').then(m => m.HomeComponent)},
    {path: '**', loadComponent: () => import('./common/components/home/home.component').then(m => m.HomeComponent)},
];
