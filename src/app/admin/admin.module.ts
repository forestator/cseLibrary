import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
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
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSelectModule} from '@angular/material/select';
import {AddGameFormComponent} from './components/admin-ludo/admin-games/add-game-form/add-game-form.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {LudothequeModule} from '../ludotheque/ludotheque.module';
import {AddGameModalComponent} from './components/admin-ludo/admin-games/add-game-modal/add-game-modal.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {EditGameModalComponent} from './components/admin-ludo/admin-games/edit-game-modal/edit-game-modal.component';
import {AdminBricolageComponent} from './components/admin-bricolage/admin-bricolage.component';
import {BricoTableComponent} from './components/admin-bricolage/brico-table/brico-table.component';
import {AddToolModalComponent} from './components/admin-bricolage/add-tool-modal/add-tool-modal.component';
import {EditToolModalComponent} from './components/admin-bricolage/edit-tool-modal/edit-tool-modal.component';
import {UploadGameComponent} from './components/admin-ludo/admin-games/upload-game/upload-game.component';
import {ConfirmationModal} from './components/confirmation-modal/confirmation-modal.component';
import {AdminSonothequeComponent} from './components/admin-sonotheque/admin-sonotheque.component';
import {SonoTableComponent} from './components/admin-sonotheque/sono-table/sono-table.component';
import {
    AddSonoItemModalComponent
} from './components/admin-sonotheque/add-sono-item-modal/add-sono-item-modal.component';
import {
    EditSonoItemModalComponent
} from './components/admin-sonotheque/edit-sono-item-modal/edit-sono-item-modal.component';
import {MatIconModule} from '@angular/material/icon';
import {
    BggGameSearchModalComponent
} from './components/admin-ludo/admin-games/bgg-game-search-modal/bgg-game-search-modal.component';
import {AdminNautismeComponent} from './components/admin-nautisme/admin-nautisme.component';
import {
    AddNautismeItemModalComponent
} from './components/admin-nautisme/add-nautisme-item-modal/add-nautisme-item-modal.component';
import {
    EditNautismeItemModalComponent
} from './components/admin-nautisme/edit-nautisme-item-modal/edit-nautisme-item-modal.component';
import {NautismeTableComponent} from './components/admin-nautisme/nautisme-table/nautisme-table.component';


@NgModule({
    declarations: [
        AdminHomeComponent,
        AdminGamesComponent,
        LudoTableComponent,
        AddEmployeeDialogComponent,
        AdminMenuComponent, AddGameFormComponent, AddGameModalComponent, EditGameModalComponent, AdminBricolageComponent, BricoTableComponent, AddToolModalComponent, EditToolModalComponent, UploadGameComponent, ConfirmationModal, AdminSonothequeComponent, SonoTableComponent, AddSonoItemModalComponent, EditSonoItemModalComponent, BggGameSearchModalComponent, AdminNautismeComponent, AddNautismeItemModalComponent, EditNautismeItemModalComponent, NautismeTableComponent
    ],
    exports: [
        AdminMenuComponent,
        ConfirmationModal
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
        MatIconModule,
        NgOptimizedImage,
    ]
})
export class AdminModule {
}
