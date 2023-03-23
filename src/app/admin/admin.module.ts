import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminHomeComponent} from './components/admin-home/admin-home.component';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {FirebaseUIModule} from 'firebaseui-angular';
import {AdminGamesComponent} from './components/admin-games/admin-games.component';
import {BorrowGamesComponent} from './components/borrow-games/borrow-games.component';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import {AppCommonModule} from '../common/app-common.module';
import {LudoTableComponent} from './components/ludo-table/ludo-table.component';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {AddEmployeeDialogComponent} from './components/add-employee-dialog/add-employee-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {AdminMenuComponent} from './components/admin-menu/admin-menu.component';
import {RouterLink} from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {
  ChangeBorrowStatusModalComponent
} from './components/borrow-games/change-borrow-status/change-borrow-status-modal.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSelectModule} from '@angular/material/select';
import {AddGameComponent} from './components/admin-games/add-game/add-game.component';
import {AddGameFormComponent} from './components/admin-games/add-game-form/add-game-form.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {LastBorrowDatesPipe} from './pipe/last-borrow-dates.pipe';
import {LudothequeModule} from '../ludotheque/ludotheque.module';
import {AddGameModalComponent} from './components/admin-games/add-game-modal/add-game-modal.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {EditGameModalComponent} from './components/admin-games/edit-game-modal/edit-game-modal.component';


@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminGamesComponent,
    BorrowGamesComponent,
    LudoTableComponent,
    AddEmployeeDialogComponent,
    ChangeBorrowStatusModalComponent,
    AdminMenuComponent, AddGameComponent, AddGameFormComponent, LastBorrowDatesPipe, AddGameModalComponent, EditGameModalComponent
  ],
  exports: [
    AdminMenuComponent
  ],
    imports: [
        CommonModule,
        AngularFireAuthModule,
        FirebaseUIModule,
        MatSortModule,
        MatTableModule,
        MatExpansionModule,
        AppCommonModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        RouterLink,
        MatListModule,
        MatAutocompleteModule,
        MatButtonToggleModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        LudothequeModule,
        MatProgressSpinnerModule,
    ]
})
export class AdminModule {
}
