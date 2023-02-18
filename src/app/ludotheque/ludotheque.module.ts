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
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {FormsModule} from '@angular/forms';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {BoardGamesComponent} from './components/board-games/board-games.component';
import {VideoGamesComponent} from './components/video-games/video-games.component';
import {OutsideGamesComponent} from './components/outside-games/outside-games.component';
import {
  VideoGamesConsoleDetailsComponent
} from './components/video-games/video-games-console-details/video-games-console-details.component';
import {VideoGameRowComponent} from './components/video-games/video-game-row/video-game-row.component';
import {
  VideoGameConsoleRowComponent
} from './components/video-games/video-game-console-row/video-game-console-row.component';
import {MatDividerModule} from '@angular/material/divider';
import {FilterVideoGameByTypePipe} from './pipes/filter-video-game-by-type.pipe';

@NgModule({
  declarations: [
    BoardGameCategoryDetailsComponent,
    BoardGameRowComponent,
    BoardGameDetailsPipe,
    LudothequeComponent,
    ChangeBorrowStatusComponent,
    BoardGamesComponent,
    VideoGamesComponent,
    OutsideGamesComponent,
    VideoGamesConsoleDetailsComponent,
    VideoGameRowComponent,
    VideoGameConsoleRowComponent,
    FilterVideoGameByTypePipe],
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
        MatButtonToggleModule,
        MatDividerModule
    ]
})
export class LudothequeModule {
}
