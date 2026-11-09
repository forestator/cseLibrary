import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import {map, Observable, Subscription} from "rxjs";
import {Category} from "../../../models/author.model";
import {NavigationService} from "../../../services/navigation.service";
import {MaterielPhotoItem, PhotoCategory} from '../../models/materiel-photo.model';
import {MaterielPhotoDatabaseService} from '../../services/materiel-photo-database.service';
import { MaterielPhotoRowComponent } from '../materiel-photo-row/materiel-photo-row.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-materiel-photo-category',
    templateUrl: './materiel-photo-category.component.html',
    styleUrls: ['./materiel-photo-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MaterielPhotoRowComponent, AsyncPipe]
})
export class MaterielPhotoCategoryComponent implements OnInit, OnDestroy {
  private materielPhotoDatabaseService = inject(MaterielPhotoDatabaseService);
  private navigationService = inject(NavigationService);

  category$?: Observable<Category>;
  categoryItems$?: Observable<Array<MaterielPhotoItem>>;
  searchedPhotoItemId?: string;
  categoryId?: PhotoCategory;
  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.navigationService.getRouteParams().subscribe((params) => {
      if (this.categoryId !== params['categoryId']) {
        this.categoryId = params['categoryId'];
        this.category$ = this.materielPhotoDatabaseService.photoLibrary$.pipe(
          map(lib => lib.categories.find(cat => cat.id === this.categoryId))
        );
        this.categoryItems$ = this.materielPhotoDatabaseService.getPhotoCategory(this.categoryId);
      }
      this.searchedPhotoItemId = params['id'];
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
