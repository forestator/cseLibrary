import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {MatIconModule} from '@angular/material/icon';
import {LudothequeModule} from './ludotheque/ludotheque.module';
import {BibliothequeModule} from './bibliotheque/bibliotheque.module';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ReactiveFormsModule} from '@angular/forms';
import {AppCommonModule} from './common/app-common.module';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {AdminModule} from './admin/admin.module';
import {firebase, firebaseui, FirebaseUIModule} from 'firebaseui-angular';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFireAnalyticsModule} from '@angular/fire/compat/analytics';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {BricolageModule} from './bricolage/bricolage.module';
import {SonothequeModule} from "./sonotheque/sonotheque.module";
import {NautismeModule} from "./nautisme/nautisme.module";
import {MaterielPhotoModule} from './photo/materiel-photo.module';

const firebaseConfig = {
  apiKey: "AIzaSyDK-byU9NpioO3Lve34_Y4QvxvOviDCKFY",
  authDomain: "cseh-50966.firebaseapp.com",
  databaseURL: "https://cseh-50966-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cseh-50966",
  storageBucket: "cseh-50966.appspot.com",
  messagingSenderId: "380057552327",
  appId: "1:380057552327:web:6f48c47bb21f44fd32c5e2"
};

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    },
  ],
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
};


@NgModule({ declarations: [
        AppComponent
    ],
    exports: [],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        AngularFireAnalyticsModule,
        FirebaseUIModule.forRoot(firebaseUiAuthConfig),
        LudothequeModule,
        BibliothequeModule,
        BricolageModule,
        SonothequeModule,
        NautismeModule,
        AdminModule,
        MaterielPhotoModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        AppCommonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule], providers: [{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {
}
