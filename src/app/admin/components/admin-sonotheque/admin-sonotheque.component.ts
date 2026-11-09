import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SonoDatabaseService} from "../../../sonotheque/services/sono-database.service";
import {SonoCategory, SonoItem} from "../../../sonotheque/models/sono.model";
import {Observable, take} from "rxjs";
import {AddSonoItemModalComponent} from "./add-sono-item-modal/add-sono-item-modal.component";
import {EditSonoItemModalComponent} from "./edit-sono-item-modal/edit-sono-item-modal.component";
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { SonoTableComponent } from './sono-table/sono-table.component';
import { AsyncPipe, TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-admin-sonotheque',
    templateUrl: './admin-sonotheque.component.html',
    styleUrls: ['./admin-sonotheque.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatButton, MatDivider, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, SonoTableComponent, AsyncPipe, TitleCasePipe]
})
export class AdminSonothequeComponent {
  sonoDatabaseService = inject(SonoDatabaseService);
  private dialog = inject(MatDialog);

  sonoCategories = Object.values(SonoCategory);
  openededCat?: SonoCategory;
  openededCatItems$?: Observable<SonoItem[]>;

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
