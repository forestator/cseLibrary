import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminHomeComponent} from './components/admin-home/admin-home.component';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {FirebaseUIModule} from 'firebaseui-angular';


@NgModule({
  declarations: [
    AdminHomeComponent
  ],
  imports: [
    CommonModule,
    AngularFireAuthModule,
    FirebaseUIModule
  ]
})
export class AdminModule { }
