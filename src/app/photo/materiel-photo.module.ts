import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterielPhotoHomeComponent} from './components/materiel-photo-home/materiel-photo-home.component';
import {MaterielPhotoRowComponent} from './components/materiel-photo-row/materiel-photo-row.component';
import {RouterModule} from '@angular/router';
import {AppCommonModule} from '../common/app-common.module';
import {MaterielPhotoCategoryComponent} from './components/materiel-photo-category/materiel-photo-category.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        AppCommonModule,
        MaterielPhotoHomeComponent,
        MaterielPhotoRowComponent,
        MaterielPhotoCategoryComponent
    ]
})
export class MaterielPhotoModule { }
