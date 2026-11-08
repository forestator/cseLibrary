import {Component, ChangeDetectionStrategy} from '@angular/core';
import {take} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {NautismeDatabaseService} from '../../../nautisme/services/nautisme-database.service';
import {AddNautismeItemModalComponent} from './add-nautisme-item-modal/add-nautisme-item-modal.component';
import {EditNautismeItemModalComponent} from './edit-nautisme-item-modal/edit-nautisme-item-modal.component';

@Component({
    selector: 'app-admin-nautisme',
    templateUrl: './admin-nautisme.component.html',
    styleUrls: ['./admin-nautisme.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AdminNautismeComponent {

  constructor(public nautismeDatabaseService: NautismeDatabaseService,
              private dialog: MatDialog) {
  }

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
