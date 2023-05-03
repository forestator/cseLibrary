import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NautismeHomeComponent} from './components/nautisme-home/nautisme-home.component';
import {RouterModule} from "@angular/router";
import {NautismeItemRowComponent} from './components/nautisme-item-row/nautisme-item-row.component';
import {AppCommonModule} from "../common/app-common.module";


@NgModule({
  declarations: [
    NautismeHomeComponent,
    NautismeItemRowComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppCommonModule
  ]
})
export class NautismeModule {
}
