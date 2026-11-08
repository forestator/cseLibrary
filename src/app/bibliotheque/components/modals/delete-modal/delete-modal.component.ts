import {Component, Inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DataService} from 'src/app/services/biblio/data.service';

@Component({
    selector: 'app-delete-modal',
    templateUrl: './delete-modal.component.html',
    styleUrls: ['./delete-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DeleteModalComponent implements OnInit {

   public id!: string | undefined;
   public message!: string | undefined;


   constructor(
      public dialogRef: MatDialogRef<DeleteModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { id: string, message: string },
      public dataService: DataService) {
         this.id = data.id;
         this.message = data.message;
   }

   ngOnInit(): void {
   }

   cancel(): void {
      this.dialogRef.close(false);
   }

   confirm(): void {
      this.dialogRef.close(true);
   }
}
