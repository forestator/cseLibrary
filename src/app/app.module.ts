import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';

import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';

import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';

import {LibraryMenuComponent} from './components/library-menu/library-menu.component';
import {SeriesRowComponent} from './components/category-view/series-row/series-row.component';
import {SeriesViewComponent} from './components/series-view/series-view.component';
import {SeriesBadgeComponent} from './components/common/series-badge/series-badge.component';
import {BookRowComponent} from './components/series-view/book-row/book-row.component';
import {BookBadgeComponent} from './components/common/book-badge/book-badge.component';
import {SettingsViewComponent} from './components/settings-view/settings-view.component';
import {SettingsCategoryComponent} from './components/settings-view/settings-category/settings-category.component';
import {
    SettingsSeriesComponent
} from './components/settings-view/settings-category/settings-series/settings-series.component';
import {
    SettingsBookComponent
} from './components/settings-view/settings-category/settings-series/settings-book/settings-book.component';
import {SeriesModalComponent} from './components/modals/series-modal/series-modal.component';
import {BookModalComponent} from './components/modals/book-modal/book-modal.component';
import {SearchModalComponent} from './components/modals/search-modal/search-modal.component';
import {AuthorsViewComponent} from './components/authors-view/authors-view.component';
import {AuthorRowComponent} from './components/authors-view/author-row/author-row.component';
import {NewViewComponent} from './components/new-view/new-view.component';
import {AuthorViewComponent} from './components/author-view/author-view.component';
import {AlphabetComponent} from './components/common/alphabet/alphabet.component';
import {LibraryViewComponent} from './components/library-view/library-view.component';
import {
    SettingsAuthorComponent
} from './components/settings-view/settings-category/settings-author/settings-author.component';
import {AuthorModalComponent} from './components/modals/author-modal/author-modal.component';
import {CategoryModalComponent} from './components/modals/category-modal/category-modal.component';
import {DeleteModalComponent} from './components/modals/delete-modal/delete-modal.component';
import {SettingsAuthorsComponent} from './components/settings-view/settings-authors/settings-authors.component';
import {
    SettingsPublishersComponent
} from './components/settings-view/settings-publishers/settings-publishers.component';
import {
    SettingsPublisherComponent
} from './components/settings-view/settings-publishers/settings-publisher/settings-publisher.component';
import {PublisherModalComponent} from './components/modals/publisher-modal/publisher-modal.component';
import {BookFilterPipe} from './pipes/book-filter.pipe';
import {SeriesFilterPipe} from './pipes/series-filter.pipe';
import {LudothequeModule} from './ludotheque/ludotheque.module';

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
        SeriesRowComponent,
        SeriesViewComponent,
        SeriesBadgeComponent,
        BookRowComponent,
        BookBadgeComponent,
        SettingsViewComponent,
        SettingsCategoryComponent,
        SettingsSeriesComponent,
        SettingsBookComponent,
        SeriesModalComponent,
        BookModalComponent,
        SearchModalComponent,
        AuthorsViewComponent,
        AuthorRowComponent,
        NewViewComponent,
        AuthorViewComponent,
        AlphabetComponent,
        LibraryViewComponent,
        SettingsAuthorComponent,
        AuthorModalComponent,
        CategoryModalComponent,
        DeleteModalComponent,
        SettingsAuthorsComponent,
        SettingsPublishersComponent,
        SettingsPublisherComponent,
        PublisherModalComponent,
        BookFilterPipe,
        SeriesFilterPipe,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule, // firestore
        AngularFireAuthModule, // auth
        AngularFireStorageModule, // storage
        AngularFireDatabaseModule,
        BrowserAnimationsModule,
        MatExpansionModule,
        MatTableModule,
        MatIconModule,
        MatDialogModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatRadioModule,
        MatCheckboxModule,
        MatMenuModule,
        FormsModule,
        LudothequeModule
    ],
    exports: [
        MatExpansionModule,
        MatTableModule,
        MatIconModule,
    ],
    providers: [BookFilterPipe],
    bootstrap: [AppComponent]
})
export class AppModule {
}
