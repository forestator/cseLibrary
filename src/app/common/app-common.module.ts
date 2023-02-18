import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LibraryMenuComponent} from './components/library-menu/library-menu.component';
import {SearchInLibComponent} from './components/search-in-lib/search-in-lib.component';
import {BadgeComponent} from './components/book-badge/badge.component';
import {HomeComponent} from './components/home/home.component';
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import {ReactiveFormsModule} from '@angular/forms';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    LibraryMenuComponent,
    HomeComponent,
    SearchInLibComponent,
    BadgeComponent
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
    LibraryMenuComponent,
    HomeComponent,
    SearchInLibComponent,
    BadgeComponent
  ]
})
export class AppCommonModule {
}
