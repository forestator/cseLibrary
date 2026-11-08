import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, Observable, Subscription} from "rxjs";
import {Category} from "../../../models/author.model";
import {NavigationService} from "../../../services/navigation.service";
import {SonoCategory, SonoItem} from "../../models/sono.model";
import {SonoDatabaseService} from "../../services/sono-database.service";

@Component({
    selector: 'app-sono-category',
    templateUrl: './sono-category.component.html',
    styleUrls: ['./sono-category.component.scss'],
    standalone: false
})
export class SonoCategoryComponent implements OnInit, OnDestroy {
  category$?: Observable<Category>;
  categoryItems$?: Observable<Array<SonoItem>>;
  searchedSonoItemId?: string;
  categoryId?: SonoCategory;
  private sub?: Subscription;

  constructor(private sonoDatabaseService: SonoDatabaseService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {
    this.sub = this.navigationService.getRouteParams().subscribe((params) => {
      if (this.categoryId !== params['categoryId']) {
        this.categoryId = params['categoryId'];
        this.category$ = this.sonoDatabaseService.sonothequeLibrary$.pipe(
          map(lib => lib.categories.find(cat => cat.id === this.categoryId))
        );
        this.categoryItems$ = this.sonoDatabaseService.getSonoCategory(this.categoryId);
      }
      this.searchedSonoItemId = params['id'];
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
