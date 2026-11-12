import {inject} from '@angular/core';
import {Routes} from '@angular/router';
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

const catalogueConfigs = [BRICOLAGE_CONFIG, SONOTHEQUE_CONFIG, NAUTISME_CONFIG, PHOTO_CONFIG];

const adminGuard = () => inject(AuthentificationService).isUserAnyAdmin$;
const loadAdminCatalogue = () => import('./admin/catalogue/admin-catalogue').then(m => m.AdminCatalogue);

const adminRoutes: Routes = [
    {
        path: 'iWantToConfigureThisAwesomeApp', loadComponent: () => import('./admin/components/admin-home/admin-home.component').then(m => m.AdminHomeComponent)
    },
    {path: 'admin', loadComponent: loadAdminCatalogue, canActivate: [adminGuard]},
    {path: 'admin/:commission', loadComponent: loadAdminCatalogue, canActivate: [adminGuard]},
    // Former per-commission administration addresses, kept for old bookmarks.
    {path: 'ludotheque/admin/games', redirectTo: 'admin/ludotheque'},
    {path: 'bibliotheque/admin/:libraryId', redirectTo: 'admin/bibliotheque'},
    ...catalogueConfigs.map(config => ({path: `${config.id}/admin/:page`, redirectTo: `admin/${config.id}`})),
];

export const routes: Routes = [
    ...adminRoutes,
    ...ludoRoutes,
    ...biblioRoutes,
    ...catalogueConfigs.flatMap(catalogueRoutes),
    {path: '', loadComponent: () => import('./common/components/home/home.component').then(m => m.HomeComponent)},
    {path: '**', loadComponent: () => import('./common/components/home/home.component').then(m => m.HomeComponent)},
];
