import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {MatIconModule} from '@angular/material/icon';

import {LibraryMenuComponent} from './components/library-menu/library-menu.component';
import {HomeComponent} from './home/home.component';
import {LudothequeModule} from './ludotheque/ludotheque.module';
import {BibliothequeModule} from './bibliotheque/bibliotheque.module';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const firebaseConfig = {
    apiKey: "AIzaSyDBvqQptbNHI8nngeGAt0IhKrrGMGBR0PY",
    authDomain: "csebiblio.firebaseapp.com",
    projectId: "csebiblio",
    storageBucket: "csebiblio.appspot.com",
    messagingSenderId: "590961298237",
    appId: "1:590961298237:web:2171ab2048ec8d182c9354"
};

@NgModule({
    declarations: [
        AppComponent,
        LibraryMenuComponent,
        HomeComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule, // firestore
        AngularFireAuthModule, // auth
        AngularFireStorageModule, // storage
        AngularFireDatabaseModule,
        LudothequeModule,
        BibliothequeModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        HttpClientModule,
        BrowserAnimationsModule
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
