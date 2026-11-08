import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Biblio, Category} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import {AuthorModalComponent} from '../modals/author-modal/author-modal.component';
import {CategoryModalComponent} from '../modals/category-modal/category-modal.component';
import {PublisherModalComponent} from '../modals/publisher-modal/publisher-modal.component';
import {NavigationService} from '../../../services/navigation.service';
import {mergeMap, take} from 'rxjs';
import {Params} from '@angular/router';
import {BiblioDatabaseService} from '../../services/biblio-database.service';

@Component({
    selector: 'app-settings-view',
    templateUrl: './settings-view.component.html',
    styleUrls: ['./settings-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SettingsViewComponent implements OnInit {

  biblio?: Biblio;

  public categoryDisplayed: Category | undefined;
  public index: number | undefined;

  public isAuthorsDisplayed: boolean;
  public isPublishersDisplayed: boolean;

  constructor(public dialog: MatDialog,
              private navService: NavigationService,
              private biblioDatabaseService: BiblioDatabaseService,
              public dataService: DataService) {
    this.isAuthorsDisplayed = false;
    this.isPublishersDisplayed = false;
    this.categoryDisplayed = undefined;
  }

  ngOnInit(): void {
    this.navService.getRouteParams().pipe(
      mergeMap((params: Params) => this.biblioDatabaseService.getBiblio(params['libraryId']!)),
      take(1)
    ).subscribe(biblio => this.biblio = biblio);
  }

  public displayAuthors() {
    this.isAuthorsDisplayed = true;
    this.isPublishersDisplayed = false;
    this.categoryDisplayed = undefined;
  }

  public displayPublishers() {
    this.isAuthorsDisplayed = false;
    this.isPublishersDisplayed = true;
    this.categoryDisplayed = undefined;
  }

  public displayCategory(category: Category) {
    this.categoryDisplayed = category;
    this.isAuthorsDisplayed = false;
    this.isPublishersDisplayed = false;
  }

  public edit($event: any) {
    console.log('edit library');
    $event.stopPropagation();
  }

  public addCategory($event: any) {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(
      CategoryModalComponent, {
        height: 'auto',
        width: '1200px',
        data: {parent: this.biblio.library, category: null}
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // add category
        this.biblioDatabaseService.addCategory(this.biblio, result);
      }
    });

  }

  public addAuthor($event: any) {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(
      AuthorModalComponent, {
        height: 'auto',
        width: '1200px',
        data: {parent: this.biblio.library, author: null}
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // add author
        this.biblioDatabaseService.addAuthor(this.biblio, result);
      }
    });
  }

  public addPublisher($event: any) {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(
      PublisherModalComponent, {
        height: 'auto',
        width: '1200px',
        data: {parent: this.biblio.library, publisher: null}
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // add publisher
        this.biblioDatabaseService.addPublisher(this.biblio, result);
      }
    });
  }

  public delete($event: any) {
    $event.stopPropagation();
  }

  public deleteCategory($event: string) {
  }

  public deleteAuthor($event: string) {
  }

  public deletePublisher($event: string) {
  }
}


