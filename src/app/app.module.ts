import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {MatIconModule} from '@angular/material/icon';
import {LudothequeModule} from './ludotheque/ludotheque.module';
import {BibliothequeModule} from './bibliotheque/bibliotheque.module';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import {ReactiveFormsModule} from '@angular/forms';
import {AppCommonModule} from './common/app-common.module';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyDK-byU9NpioO3Lve34_Y4QvxvOviDCKFY",
  authDomain: "cseh-50966.firebaseapp.com",
  databaseURL: "https://cseh-50966-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cseh-50966",
  storageBucket: "cseh-50966.appspot.com",
  messagingSenderId: "380057552327",
  appId: "1:380057552327:web:6f48c47bb21f44fd32c5e2"
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    LudothequeModule,
    BibliothequeModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AppCommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
