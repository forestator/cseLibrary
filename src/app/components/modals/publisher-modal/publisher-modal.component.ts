import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Library, Publisher } from 'src/app/models/author.model';
import { DataService } from 'src/app/services/data.service';
import { BasicModal } from '../basic-modal';
import { v4 as uuidv4 } from 'uuid';

@Component({
   selector: 'app-publisher-modal',
   templateUrl: './publisher-modal.component.html',
   styleUrls: ['./publisher-modal.component.scss']
})
export class PublisherModalComponent extends BasicModal implements OnInit {

   public name = new FormControl();

   constructor(
      public dialogRef: MatDialogRef<PublisherModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { parent: Library, publisher: Publisher },
      public dataService: DataService) {
      super();
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
