import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LudothequeComponent} from './ludotheque/components/ludotheque/ludotheque.component';
import {
    BoardGameCategoryDetailsComponent
} from './ludotheque/components/board-game-category-details/board-game-category-details.component';

const routes: Routes = [
    {path: 'ludotheque', component: LudothequeComponent},
    {path: 'ludotheque/:id', component: BoardGameCategoryDetailsComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
