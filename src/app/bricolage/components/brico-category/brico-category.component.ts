import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import {map, Observable, Subscription} from 'rxjs';
import {NavigationService} from '../../../services/navigation.service';
import {BricolageDatabaseService} from '../../services/bricolage-database.service';
import {Tool} from '../../models/bricolage.model';
import {Category} from '../../../models/author.model';
import { ToolRowComponent } from '../tool-row/tool-row.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-brico-category',
    templateUrl: './brico-category.component.html',
    styleUrls: ['./brico-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ToolRowComponent, AsyncPipe]
})
export class BricoCategoryComponent implements OnInit, OnDestroy {
  private bricolageDatabaseService = inject(BricolageDatabaseService);
  private navigationService = inject(NavigationService);

  category$?: Observable<Category>;
  categoryTools$?: Observable<Array<Tool>>;
  searchedToolId?: string;
  categoryId?: string;
  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.navigationService.getRouteParams().subscribe((params) => {
      if (this.categoryId !== params['categoryId']) {
        this.categoryId = params['categoryId'];
        this.category$ = this.bricolageDatabaseService.bricolageLibrary$.pipe(
          map(lib => lib.categories.find(cat => cat.id === this.categoryId))
        );
        this.categoryTools$ = this.bricolageDatabaseService.getBricoCategory(this.categoryId);
      }
      this.searchedToolId = params['id'];
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
