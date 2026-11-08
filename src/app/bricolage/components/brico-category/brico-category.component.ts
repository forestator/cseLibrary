import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, Observable, Subscription} from 'rxjs';
import {NavigationService} from '../../../services/navigation.service';
import {BricolageDatabaseService} from '../../services/bricolage-database.service';
import {Tool} from '../../models/bricolage.model';
import {Category} from '../../../models/author.model';

@Component({
    selector: 'app-brico-category',
    templateUrl: './brico-category.component.html',
    styleUrls: ['./brico-category.component.scss'],
    standalone: false
})
export class BricoCategoryComponent implements OnInit, OnDestroy {
  category$?: Observable<Category>;
  categoryTools$?: Observable<Array<Tool>>;
  searchedToolId?: string;
  categoryId?: string;
  private sub?: Subscription;

  constructor(private bricolageDatabaseService: BricolageDatabaseService,
              private navigationService: NavigationService) {
  }

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
