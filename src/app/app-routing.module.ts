import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LudothequeComponent} from './ludotheque/components/ludotheque/ludotheque.component';
import {
  BoardGameCategoryDetailsComponent
} from './ludotheque/components/board-game-category-details/board-game-category-details.component';
import {BibliothequeComponent} from './bibliotheque/components/bibliotheque/bibliotheque.component';
import {HomeComponent} from './common/home/home.component';
import {LibraryViewComponent} from './bibliotheque/components/library-view/library-view.component';
import {CategoryViewComponent} from './bibliotheque/components/category-view/category-view.component';
import {SeriesViewComponent} from './bibliotheque/components/series-view/series-view.component';
import {NewViewComponent} from './bibliotheque/components/new-view/new-view.component';

const routes: Routes = [
    {path: 'ludotheque', component: LudothequeComponent},
    {path: 'ludotheque/:categoryId', component: BoardGameCategoryDetailsComponent},
    {path: 'ludotheque/:categoryId/:id', component: BoardGameCategoryDetailsComponent},
    {path: 'ludotheque/new', component: BoardGameCategoryDetailsComponent},
    {path: 'bibliotheque', component: BibliothequeComponent},
    {path: 'bibliotheque/new', component: NewViewComponent},
    {path: 'bibliotheque/:libraryId', component: LibraryViewComponent},
    {path: 'bibliotheque/:libraryId/:catId', component: CategoryViewComponent},
    {path: 'bibliotheque/:libraryId/:catId/:seriesId', component: SeriesViewComponent},
    {path: '', component: HomeComponent},
    {path: '**', component: HomeComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
