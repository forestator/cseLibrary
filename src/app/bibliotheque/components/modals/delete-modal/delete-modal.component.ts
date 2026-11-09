import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import {DataService} from 'src/app/services/biblio/data.service';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-delete-modal',
    templateUrl: './delete-modal.component.html',
    styleUrls: ['./delete-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDialogTitle, MatIcon, CdkScrollable, MatDialogContent, MatDialogActions, MatButton]
})
export class DeleteModalComponent implements OnInit {
   dialogRef = inject<MatDialogRef<DeleteModalComponent>>(MatDialogRef);
   data = inject<{
    id: string;
    message: string;
}>(MAT_DIALOG_DATA);
   dataService = inject(DataService);


   public id!: string | undefined;
   public message!: string | undefined;


   constructor() {
         const data = this.data;

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
