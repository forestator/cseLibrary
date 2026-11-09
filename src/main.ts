import { enableProdMode, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideHttpClient, withXhr, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { BibliothequeModule } from './app/bibliotheque/bibliotheque.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AppComponent } from './app/app.component';

const firebaseConfig = {
  apiKey: "AIzaSyDK-byU9NpioO3Lve34_Y4QvxvOviDCKFY",
  authDomain: "cseh-50966.firebaseapp.com",
  databaseURL: "https://cseh-50966-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cseh-50966",
  storageBucket: "cseh-50966.appspot.com",
  messagingSenderId: "380057552327",
  appId: "1:380057552327:web:6f48c47bb21f44fd32c5e2"
};



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, AngularFireModule.initializeApp(firebaseConfig), AngularFireDatabaseModule, AngularFireAnalyticsModule, BibliothequeModule, MatIconModule, MatButtonModule, MatMenuModule, BrowserAnimationsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, MatToolbarModule, MatSidenavModule, MatListModule),
        { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, provideHttpClient(withXhr(), withInterceptorsFromDi())
    ]
})
  .catch(err => console.error(err));
