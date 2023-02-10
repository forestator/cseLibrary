import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LudothequeComponent} from './ludotheque/components/ludotheque/ludotheque.component';
import {
    BoardGameCategoryDetailsComponent
} from './ludotheque/components/board-game-category-details/board-game-category-details.component';
import {BibliothequeComponent} from './bibliotheque/components/bibliotheque/bibliotheque.component';
import {HomeComponent} from './home/home.component';
import {CategoryViewComponent} from './bibliotheque/components/category-view/category-view.component';

const routes: Routes = [
    {path: 'ludotheque', component: LudothequeComponent},
    {path: 'ludotheque/:id', component: BoardGameCategoryDetailsComponent},
    {path: 'bibliotheque', component: BibliothequeComponent},
    {path: 'bibliotheque/:id', component: CategoryViewComponent},
    {path: '', component: HomeComponent},
    {path: '**', component: HomeComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
