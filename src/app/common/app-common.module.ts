import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BadgeComponent} from './components/book-badge/badge.component';
import {HomeComponent} from './components/home/home.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {BorrowedByUserPipe} from './pipe/borrowed-by-user.pipe';
import {UploadFormComponent} from './components/upload-form/upload-form.component';

@NgModule({
  declarations: [
    HomeComponent,
    BadgeComponent,
    BorrowedByUserPipe,
    UploadFormComponent
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule,
    MatIconModule
  ],
    exports: [
        HomeComponent,
        BadgeComponent,
        BorrowedByUserPipe,
        UploadFormComponent
    ]
})
export class AppCommonModule {
}
