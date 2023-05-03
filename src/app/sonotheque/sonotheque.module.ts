import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SonoHomeComponent} from './components/sono-home/sono-home.component';
import {SonoCategoryComponent} from './components/sono-category/sono-category.component';
import {RouterModule} from "@angular/router";
import {SonoItemRowComponent} from './components/sono-item-row/sono-item-row.component';
import {AppCommonModule} from "../common/app-common.module";


@NgModule({
  declarations: [
    SonoHomeComponent,
    SonoCategoryComponent,
    SonoItemRowComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppCommonModule,
  ]
})
export class SonothequeModule { }
