import {Component, ChangeDetectionStrategy} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SonoDatabaseService} from "../../../sonotheque/services/sono-database.service";
import {SonoCategory, SonoItem} from "../../../sonotheque/models/sono.model";
import {Observable, take} from "rxjs";
import {AddSonoItemModalComponent} from "./add-sono-item-modal/add-sono-item-modal.component";
import {EditSonoItemModalComponent} from "./edit-sono-item-modal/edit-sono-item-modal.component";

@Component({
    selector: 'app-admin-sonotheque',
    templateUrl: './admin-sonotheque.component.html',
    styleUrls: ['./admin-sonotheque.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AdminSonothequeComponent {
  sonoCategories = Object.values(SonoCategory);
  openededCat?: SonoCategory;
  openededCatItems$?: Observable<SonoItem[]>;

  constructor(public sonoDatabaseService: SonoDatabaseService,
              private dialog: MatDialog) {
  }

  addItem() {
    this.sonoDatabaseService.allItems$.pipe(take(1)).subscribe(allSonoItems => {
      this.dialog.open(AddSonoItemModalComponent, {
        data: {items: allSonoItems}
      });
    })
  }

  editItem() {
    this.sonoDatabaseService.allItems$.pipe(take(1)).subscribe(allSonoItems => {
      this.dialog.open(EditSonoItemModalComponent, {
        data: {items: allSonoItems}
      });
    })
  }

  changeOpenCat(sonoCat: string) {
    this.openededCat = sonoCat as SonoCategory;
    this.openededCatItems$ = this.sonoDatabaseService.getSonoCategory(this.openededCat);
  }
}
