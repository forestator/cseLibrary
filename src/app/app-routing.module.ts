import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LudothequeComponent} from './ludotheque/components/ludotheque/ludotheque.component';
import {
    BoardGameCategoryDetailsComponent
} from './ludotheque/components/board-game-category-details/board-game-category-details.component';
import {BibliothequeComponent} from './bibliotheque/components/bibliotheque/bibliotheque.component';
import {HomeComponent} from './home/home.component';
import {LibraryViewComponent} from './bibliotheque/components/library-view/library-view.component';

const routes: Routes = [
    {path: 'ludotheque', component: LudothequeComponent},
    {path: 'ludotheque/:id', component: BoardGameCategoryDetailsComponent},
    {path: 'bibliotheque', component: BibliothequeComponent},
    {path: 'bibliotheque/:id', component: LibraryViewComponent},
    {path: '', component: HomeComponent},
    {path: '**', component: HomeComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
