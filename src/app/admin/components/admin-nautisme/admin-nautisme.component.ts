import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {take} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {NautismeDatabaseService} from '../../../nautisme/services/nautisme-database.service';
import {AddNautismeItemModalComponent} from './add-nautisme-item-modal/add-nautisme-item-modal.component';
import {EditNautismeItemModalComponent} from './edit-nautisme-item-modal/edit-nautisme-item-modal.component';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { NautismeTableComponent } from './nautisme-table/nautisme-table.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-admin-nautisme',
    templateUrl: './admin-nautisme.component.html',
    styleUrls: ['./admin-nautisme.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatButton, MatDivider, NautismeTableComponent, AsyncPipe]
})
export class AdminNautismeComponent {
  nautismeDatabaseService = inject(NautismeDatabaseService);
  private dialog = inject(MatDialog);


  addItem() {
    this.nautismeDatabaseService.allNautisme$.pipe(take(1)).subscribe(nautItems => {
      console.log(nautItems);
      this.dialog.open(AddNautismeItemModalComponent, {
        data: {items: nautItems}
      });
    })
  }

  editItem() {
    this.nautismeDatabaseService.allNautisme$.pipe(take(1)).subscribe(nautItems => {
      this.dialog.open(EditNautismeItemModalComponent, {
        data: {items: nautItems}
      });
    })
  }
}
