import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { UntypedFormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import {Library, Publisher} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import {BasicModal} from '../basic-modal';
import {v4 as uuidv4} from 'uuid';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-publisher-modal',
    templateUrl: './publisher-modal.component.html',
    styleUrls: ['./publisher-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDialogTitle, MatIcon, CdkScrollable, MatDialogContent, ReactiveFormsModule, FormsModule, MatFormField, MatLabel, MatInput, MatDialogActions, MatButton]
})
export class PublisherModalComponent extends BasicModal implements OnInit {
   dialogRef = inject<MatDialogRef<PublisherModalComponent>>(MatDialogRef);
   data = inject<{
    parent: Library;
    publisher: Publisher;
}>(MAT_DIALOG_DATA);
   dataService = inject(DataService);


   public name = new UntypedFormControl();

   constructor() {
      super();
      const data = this.data;

      if (data.publisher) {
         this.isNew = false;
         this.by = data.publisher.by;
         this.id = data.publisher.id;
         this.parentId = data.publisher.parentId;
         this.name.setValue(data.publisher.name);
      } else {
         this.isNew = true;
         this.id = uuidv4();
         this.by = data.parent.by;
         this.parentId = data.parent.id;
         this.name.setValue('');
      }
   }

   ngOnInit(): void {
   }

   cancel(): void {
      this.dialogRef.close();
   }

   save(): void {
      this.dialogRef.close(this.formToData());
   }

   protected formToData(): Publisher {
      return {
         id: this.id,
         by: this.by,
         parentId: this.parentId,
         name: this.name.value
      };
   }

}
