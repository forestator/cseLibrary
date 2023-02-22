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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
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
import {OutsideGameRowComponent} from './components/outside-games/outside-game-row/outside-game-row.component';
import {
  VideoGamesToFilterComponent
} from './components/video-games/video-games-to-filter/video-games-to-filter.component';
import {
  BoardGameToFilterComponent
} from './components/board-games/components/board-game-to-filter/board-game-to-filter.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {LudoMenuComponent} from './components/ludo-menu/ludo-menu.component';
import {SearchInLibComponent} from './components/search-in-lib/search-in-lib.component';
import {MatMenuModule} from '@angular/material/menu';
import {AdminGamesComponent} from './components/admin/admin-games/admin-games.component';
import {BorrowGamesComponent} from './components/admin/borrow-games/borrow-games.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';

@NgModule({
  declarations: [
    BoardGameCategoryDetailsComponent,
    BoardGameRowComponent,
    BoardGameDetailsPipe,
    LudothequeComponent,
    ChangeBorrowStatusComponent,
    SearchInLibComponent,
    BoardGamesComponent,
    VideoGamesComponent,
    OutsideGamesComponent,
    VideoGamesConsoleDetailsComponent,
    VideoGameRowComponent,
    VideoGameConsoleRowComponent,
    FilterVideoGameByTypePipe,
    OutsideGameRowComponent,
    VideoGamesToFilterComponent,
    BoardGameToFilterComponent,
    LudoMenuComponent,
    AdminGamesComponent,
    BorrowGamesComponent],
  exports: [LudoMenuComponent],
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
    MatDividerModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatExpansionModule,
    MatTableModule,
    MatSortModule
  ]
})
export class LudothequeModule {
}
