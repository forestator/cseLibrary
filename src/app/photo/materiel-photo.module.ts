import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterielPhotoHomeComponent} from './components/materiel-photo-home/materiel-photo-home.component';
import {MaterielPhotoRowComponent} from './components/materiel-photo-row/materiel-photo-row.component';
import {RouterModule} from '@angular/router';
import {AppCommonModule} from '../common/app-common.module';
import {MaterielPhotoCategoryComponent} from './components/materiel-photo-category/materiel-photo-category.component';


@NgModule({
  declarations: [
    MaterielPhotoHomeComponent,
    MaterielPhotoRowComponent,
    MaterielPhotoCategoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppCommonModule
  ]
})
export class MaterielPhotoModule { }
