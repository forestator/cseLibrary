import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Category, Library} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/data.service';
import {BasicModal} from '../basic-modal';
import {v4 as uuidv4} from 'uuid';

@Component({
   selector: 'app-category-modal',
   templateUrl: './category-modal.component.html',
   styleUrls: ['./category-modal.component.scss']
})
export class CategoryModalComponent extends BasicModal implements OnInit {

   public name = new UntypedFormControl();
   public resume = new UntypedFormControl();
   public visuel = new UntypedFormControl();
   public prefix = new UntypedFormControl();

   constructor(
      public dialogRef: MatDialogRef<CategoryModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { parent: Library, category: Category },
      public dataService: DataService) {
      super();
      if (data.category) {
         this.isNew = false;
         this.id = data.category.id;
         this.parentId = data.category.parentId;
         this.by = data.category.by;
         this.name.setValue(data.category.name);
         this.resume.setValue(data.category.resume);
         this.prefix.setValue(data.category.prefix);
         this.visuel.setValue(data.category.bg);
      } else {
         this.isNew = true;
         this.id = uuidv4();
         this.parentId = data.parent.id;
         this.by = data.parent.by;
         this.name.setValue('');
         this.resume.setValue('');
         this.prefix.setValue('');
         this.visuel.setValue('');
      }
   }

   ngOnInit(): void {
   }

   cancel(): void {
      this.dialogRef.close(false);
   }

   save(): void {
      this.dialogRef.close(this.formToData());
   }

   protected formToData(): Category {
      return {
         id: this.id,
         parentId: this.parentId,
         by: this.by,
         name: this.name.value,
         resume: this.resume.value,
         prefix: this.prefix.value,
         bg: this.visuel.value
      };
   }

}
