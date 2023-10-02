import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Comissions, Game} from '../../../../models/common.model';
import {Tool} from '../../../../bricolage/models/bricolage.model';
import {SonoItem} from '../../../../sonotheque/models/sono.model';
import {NautismeItem} from '../../../../nautisme/models/nautisme.model';
import {UserService} from '../../../../services/firebase/user.service';
import {Observable} from 'rxjs';
import {BorrowDataService} from '../../../services/borrow-data.service';
import {BorrowByComission} from '../../../models/borrow.model';

@Component({
  selector: 'app-borrow-planning-modal',
  templateUrl: './borrow-planning-modal.component.html',
  styleUrls: ['./borrow-planning-modal.component.scss']
})
export class BorrowPlanningModalComponent {
  borrowInformations$: Observable<BorrowByComission[]>;

  constructor(
    public dialogRef: MatDialogRef<BorrowPlanningModalComponent>,
    public userService: UserService,
    public borrowDataService: BorrowDataService,
    @Inject(MAT_DIALOG_DATA) public data: {
      comission: Comissions,
      object: Tool | Game | SonoItem | NautismeItem
    },
  ) {
    this.borrowInformations$ = this.borrowDataService.getBorrowsOfComission(this.data.comission);
  }

  cancel() {
    this.dialogRef.close();
  }
}
