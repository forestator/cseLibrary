import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LibraryMenuComponent} from './library-menu/library-menu.component';
import {SearchInLibComponent} from './search-in-lib/search-in-lib.component';
import {BadgeComponent} from './book-badge/badge.component';
import {HomeComponent} from './home/home.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    LibraryMenuComponent,
    HomeComponent,
    SearchInLibComponent,
    BadgeComponent],
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
    LibraryMenuComponent,
    HomeComponent,
    SearchInLibComponent,
    BadgeComponent
  ]
})
export class AppCommonModule {
}
