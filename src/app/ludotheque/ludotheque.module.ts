import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardGameDetailsPipe} from './pipes/boardGameDetailPipe/board-game-details.pipe';
import {
  BoardGameCategoryDetailsComponent
} from './components/board-games/components/board-game-category-details/board-game-category-details.component';
import {BoardGameRowComponent} from './components/board-games/components/board-game-row/board-game-row.component';
import {LudothequeComponent} from './components/ludotheque/ludotheque.component';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {AppCommonModule} from '../common/app-common.module';
import {ChangeBorrowStatusComponent} from './components/change-borrow-status/change-borrow-status.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {BoardGamesComponent} from './components/board-games/board-games.component';
import {VideoGamesComponent} from './components/video-games/video-games.component';
import {OutsideGamesComponent} from './components/outside-games/outside-games.component';

@NgModule({
  declarations: [
    BoardGameCategoryDetailsComponent,
    BoardGameRowComponent,
    BoardGameDetailsPipe,
    LudothequeComponent,
    ChangeBorrowStatusComponent,
    BoardGamesComponent,
    VideoGamesComponent,
    OutsideGamesComponent],
  exports: [],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    AppCommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule
  ]
})
export class LudothequeModule {
}
