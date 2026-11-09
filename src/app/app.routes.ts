import {inject} from '@angular/core';
import {Route, Routes} from '@angular/router';
import {CommissionConfig} from './catalogue/models/commission-config.model';
import {BRICOLAGE_CONFIG, NAUTISME_CONFIG, PHOTO_CONFIG, SONOTHEQUE_CONFIG} from './catalogue/models/commission-configs';
import {AuthentificationService} from './services/firebase/authentification.service';

const ludoRoutes: Routes = [
    {path: 'ludotheque', loadComponent: () => import('./ludotheque/components/ludotheque/ludotheque.component').then(m => m.LudothequeComponent)},
    {path: 'ludotheque/outsideGames', loadComponent: () => import('./ludotheque/components/outside-games/game.component').then(m => m.GameComponent)},
    {path: 'ludotheque/outsideGames/:id', loadComponent: () => import('./ludotheque/components/outside-games/game.component').then(m => m.GameComponent)},
    {path: 'ludotheque/videoGames', loadComponent: () => import('./ludotheque/components/library-categories/library-categories.component').then(m => m.LibraryCategoriesComponent), data: {libraryId: 'videoGames'}},
    {path: 'ludotheque/videoGames/:categoryId', loadComponent: () => import('./ludotheque/components/game-category-page/game-category-page.component').then(m => m.GameCategoryPageComponent), data: {libraryId: 'videoGames'}},
    {path: 'ludotheque/videoGames/:categoryId/:id', loadComponent: () => import('./ludotheque/components/game-category-page/game-category-page.component').then(m => m.GameCategoryPageComponent), data: {libraryId: 'videoGames'}},
    {path: 'ludotheque/boardGames', loadComponent: () => import('./ludotheque/components/library-categories/library-categories.component').then(m => m.LibraryCategoriesComponent), data: {libraryId: 'boardGames'}},
    {path: 'ludotheque/boardGames/:categoryId', loadComponent: () => import('./ludotheque/components/game-category-page/game-category-page.component').then(m => m.GameCategoryPageComponent), data: {libraryId: 'boardGames'}},
    {path: 'ludotheque/boardGames/:categoryId/:id', loadComponent: () => import('./ludotheque/components/game-category-page/game-category-page.component').then(m => m.GameCategoryPageComponent), data: {libraryId: 'boardGames'}},
    {path: 'ludotheque/new', loadComponent: () => import('./ludotheque/components/ludo-new/ludo-new.component').then(m => m.LudoNewComponent)},
];

const biblioRoutes: Routes = [
    {path: 'bibliotheque', loadComponent: () => import('./bibliotheque/components/bibliotheque/bibliotheque.component').then(m => m.BibliothequeComponent)},
    {path: 'bibliotheque/new', loadComponent: () => import('./bibliotheque/components/new-view/new-view.component').then(m => m.NewViewComponent)},
    {path: 'bibliotheque/:libraryId', loadComponent: () => import('./bibliotheque/components/library-view/library-view.component').then(m => m.LibraryViewComponent)},
    {path: 'bibliotheque/:libraryId/:catId', loadComponent: () => import('./bibliotheque/components/category-view/category-view.component').then(m => m.CategoryViewComponent)},
    {path: 'bibliotheque/:libraryId/:catId/:seriesId', loadComponent: () => import('./bibliotheque/components/series-view/series-view.component').then(m => m.SeriesViewComponent)},
];

const loadCatalogueHome = () => import('./catalogue/components/catalogue-home/catalogue-home').then(m => m.CatalogueHome);
const loadCatalogueCategory = () => import('./catalogue/components/catalogue-category/catalogue-category').then(m => m.CatalogueCategory);
const loadCatalogueAdmin = () => import('./admin/components/catalogue-admin/catalogue-admin').then(m => m.CatalogueAdmin);

// The commission id reaches the generic components as an input, through the route data.
function catalogueRoutes(config: CommissionConfig): Routes {
    const data = {commission: config.id};
    return [
        {path: config.id, loadComponent: loadCatalogueHome, data},
        ...(config.categories ? [
            {path: `${config.id}/:categoryId`, loadComponent: loadCatalogueCategory, data},
            {path: `${config.id}/:categoryId/:id`, loadComponent: loadCatalogueCategory, data},
        ] : []),
    ];
}

function catalogueAdminRoute(config: CommissionConfig): Route {
    return {
        path: `${config.id}/${config.adminLink.path}`, loadComponent: loadCatalogueAdmin, data: {commission: config.id},
        canActivate: [() => inject(AuthentificationService)[config.adminLink.guard]]
    };
}

const catalogueConfigs = [BRICOLAGE_CONFIG, SONOTHEQUE_CONFIG, NAUTISME_CONFIG, PHOTO_CONFIG];

const adminRoutes: Routes = [
    {
        path: 'iWantToConfigureThisAwesomeApp', loadComponent: () => import('./admin/components/admin-home/admin-home.component').then(m => m.AdminHomeComponent)
    },
    {
        path: 'ludotheque/admin/games', loadComponent: () => import('./admin/components/admin-ludo/admin-games/admin-games.component').then(m => m.AdminGamesComponent),
        canActivate: [() => inject(AuthentificationService).isUserLudoAdmin$]
    },
    ...[BRICOLAGE_CONFIG, SONOTHEQUE_CONFIG, NAUTISME_CONFIG].map(catalogueAdminRoute),
    {
        path: 'bibliotheque/admin/:libraryId', loadComponent: () => import('./bibliotheque/components/settings-view/settings-view.component').then(m => m.SettingsViewComponent),
        canActivate: [() => inject(AuthentificationService).isUserSuperAdmin],
    },
];

export const routes: Routes = [
    ...adminRoutes,
    ...ludoRoutes,
    ...biblioRoutes,
    ...catalogueConfigs.flatMap(catalogueRoutes),
    {path: '', loadComponent: () => import('./common/components/home/home.component').then(m => m.HomeComponent)},
    {path: '**', loadComponent: () => import('./common/components/home/home.component').then(m => m.HomeComponent)},
];
