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
import {LudoBorrowTableComponent} from './components/borrow-games/ludo-borrow-table/ludo-borrow-table.component';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {AddEmployeeDialogComponent} from './components/add-employee-dialog/add-employee-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminGamesComponent,
    BorrowGamesComponent,
    LudoBorrowTableComponent,
    AddEmployeeDialogComponent
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
    MatSnackBarModule
  ]
})
export class AdminModule { }
