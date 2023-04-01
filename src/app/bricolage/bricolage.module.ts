import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BricolageHomeComponent} from './components/bricolage-home/bricolage-home.component';
import {RouterModule} from '@angular/router';
import {AppCommonModule} from '../common/app-common.module';
import {BricoMenuComponent} from './components/brico-menu/brico-menu.component';
import {BricoCategoryComponent} from './components/brico-category/brico-category.component';
import {ToolRowComponent} from './components/tool-row/tool-row.component';
import {LudothequeModule} from '../ludotheque/ludotheque.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    BricolageHomeComponent,
    BricoMenuComponent,
    BricoCategoryComponent,
    ToolRowComponent,
  ],
  exports: [
    BricoMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppCommonModule,
    LudothequeModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    ReactiveFormsModule
  ]
})
export class BricolageModule { }
