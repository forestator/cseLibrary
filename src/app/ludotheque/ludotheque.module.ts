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
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {BoardGamesComponent} from './components/board-games/board-games.component';
import {VideoGamesComponent} from './components/video-games/video-games.component';
import {GameComponent} from './components/outside-games/game.component';
import {
  VideoGamesConsoleDetailsComponent
} from './components/video-games/video-games-console-details/video-games-console-details.component';
import {VideoGameRowComponent} from './components/video-games/video-game-row/video-game-row.component';
import {
  VideoGameConsoleRowComponent
} from './components/video-games/video-game-console-row/video-game-console-row.component';
import {MatDividerModule} from '@angular/material/divider';
import {FilterVideoGameByTypePipe} from './pipes/filter-video-game-by-type.pipe';
import {GameRowComponent} from './components/outside-games/game-row/game-row.component';
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
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {LudoNewComponent} from './components/ludo-new/ludo-new.component';
import {GameStatusComponent} from './components/game-status/game-status.component';
import {
  FuturReservationsComponent
} from './components/board-games/components/board-game-row/futur-reservations/futur-reservations.component';
import {GameReservedForFuturWeeksPipe} from './pipes/game-reserved-for-futur-weeks.pipe';
import {UserByIdPipe} from './pipes/user-by-id.pipe';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    BoardGameCategoryDetailsComponent,
    BoardGameRowComponent,
    BoardGameDetailsPipe,
    LudothequeComponent,
    SearchInLibComponent,
    BoardGamesComponent,
    VideoGamesComponent,
    GameComponent,
    VideoGamesConsoleDetailsComponent,
    VideoGameRowComponent,
    VideoGameConsoleRowComponent,
    FilterVideoGameByTypePipe,
    GameRowComponent,
    VideoGamesToFilterComponent,
    BoardGameToFilterComponent,
    LudoMenuComponent,
    LudoNewComponent,
    GameStatusComponent,
    GameReservedForFuturWeeksPipe,
    FuturReservationsComponent,
    UserByIdPipe],
  exports: [LudoMenuComponent, GameStatusComponent],
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
        MatSortModule,
        MatCheckboxModule
    ]
})
export class LudothequeModule {
}
