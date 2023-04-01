import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BricolageHomeComponent} from './components/bricolage-home/bricolage-home.component';
import {RouterModule} from '@angular/router';
import {AppCommonModule} from '../common/app-common.module';
import {BricoMenuComponent} from './components/brico-menu/brico-menu.component';
import {BricoCategoryComponent} from './components/brico-category/brico-category.component';
import {ToolRowComponent} from './components/tool-row/tool-row.component';
import {LudothequeModule} from '../ludotheque/ludotheque.module';

@NgModule({
  declarations: [
    BricolageHomeComponent,
    BricoMenuComponent,
    BricoCategoryComponent,
    ToolRowComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppCommonModule,
    LudothequeModule
  ]
})
export class BricolageModule { }
