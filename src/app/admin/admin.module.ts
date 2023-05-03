import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminHomeComponent} from './components/admin-home/admin-home.component';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {FirebaseUIModule} from 'firebaseui-angular';
import {AdminGamesComponent} from './components/admin-ludo/admin-games/admin-games.component';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import {AppCommonModule} from '../common/app-common.module';
import {LudoTableComponent} from './components/admin-ludo/ludo-table/ludo-table.component';
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
} from './components/emprunts/change-borrow-status/change-borrow-status-modal.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSelectModule} from '@angular/material/select';
import {AddGameFormComponent} from './components/admin-ludo/admin-games/add-game-form/add-game-form.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {LastBorrowDatesPipe} from './pipe/last-borrow-dates.pipe';
import {LudothequeModule} from '../ludotheque/ludotheque.module';
import {AddGameModalComponent} from './components/admin-ludo/admin-games/add-game-modal/add-game-modal.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {EditGameModalComponent} from './components/admin-ludo/admin-games/edit-game-modal/edit-game-modal.component';
import {AdminBricolageComponent} from './components/admin-bricolage/admin-bricolage.component';
import {BricoTableComponent} from './components/admin-bricolage/brico-table/brico-table.component';
import {AddToolModalComponent} from './components/admin-bricolage/add-tool-modal/add-tool-modal.component';
import {EditToolModalComponent} from './components/admin-bricolage/edit-tool-modal/edit-tool-modal.component';
import {UploadGameComponent} from './components/admin-ludo/admin-games/upload-game/upload-game.component';
import {EmpruntsHomeComponent} from './components/emprunts/emprunts-home/emprunts-home.component';
import {
  ConfirmReturnAllModalComponent
} from './components/emprunts/confirm-return-all-modal/confirm-return-all-modal.component';
import {BorrowTableComponent} from './components/emprunts/borrow-table/borrow-table.component';
import {AdminSonothequeComponent} from './components/admin-sonotheque/admin-sonotheque.component';
import {SonoTableComponent} from './components/admin-sonotheque/sono-table/sono-table.component';
import {
  AddSonoItemModalComponent
} from './components/admin-sonotheque/add-sono-item-modal/add-sono-item-modal.component';
import {
  EditSonoItemModalComponent
} from './components/admin-sonotheque/edit-sono-item-modal/edit-sono-item-modal.component';


@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminGamesComponent,
    LudoTableComponent,
    AddEmployeeDialogComponent,
    ChangeBorrowStatusModalComponent,
    AdminMenuComponent, AddGameFormComponent, LastBorrowDatesPipe, AddGameModalComponent, EditGameModalComponent, AdminBricolageComponent, BricoTableComponent, AddToolModalComponent, EditToolModalComponent, UploadGameComponent, EmpruntsHomeComponent, ConfirmReturnAllModalComponent, BorrowTableComponent, AdminSonothequeComponent, SonoTableComponent, AddSonoItemModalComponent, EditSonoItemModalComponent
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
