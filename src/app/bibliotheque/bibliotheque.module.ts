import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BibliothequeComponent} from './components/bibliotheque/bibliotheque.component';
import {SeriesRowComponent} from './components/category-view/series-row/series-row.component';
import {SeriesViewComponent} from './components/series-view/series-view.component';
import {SeriesBadgeComponent} from './components/common/series-badge/series-badge.component';
import {BookRowComponent} from './components/series-view/book-row/book-row.component';
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
import {BookFilterPipe} from '../pipes/book-filter.pipe';
import {SeriesFilterPipe} from '../pipes/series-filter.pipe';
import {CategoryViewComponent} from './components/category-view/category-view.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {RouterModule} from '@angular/router';
import {AppCommonModule} from '../common/app-common.module';

@NgModule({
  declarations: [
    BibliothequeComponent,
    SeriesRowComponent,
    SeriesViewComponent,
    SeriesBadgeComponent,
    BookRowComponent,
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
    CategoryViewComponent,
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    MatTableModule,
    RouterModule,
    AppCommonModule
  ],
  providers: [BookFilterPipe]
})
export class BibliothequeModule {
}
