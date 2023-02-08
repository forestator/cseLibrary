import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardGameDetailsPipe} from './pipes/boardGameDetailPipe/board-game-details.pipe';
import {
    BoardGameCategoryDetailsComponent
} from './components/board-game-category-details/board-game-category-details.component';
import {BoardGameRowComponent} from './components/board-game-row/board-game-row.component';
import {LudothequeComponent} from './components/ludotheque/ludotheque.component';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        BoardGameCategoryDetailsComponent,
        BoardGameRowComponent,
        BoardGameDetailsPipe,
        LudothequeComponent],
    exports: [],
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
    ]
})
export class LudothequeModule {
}
