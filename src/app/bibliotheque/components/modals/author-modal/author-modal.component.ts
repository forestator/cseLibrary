import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Author, Category, Library} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import {SeriesModalComponent} from '../series-modal/series-modal.component';
import {v4 as uuidv4} from 'uuid';
import {BasicModal} from '../basic-modal';

@Component({
    selector: 'app-author-modal',
    templateUrl: './author-modal.component.html',
    styleUrls: ['./author-modal.component.scss'],
    standalone: false
})
export class AuthorModalComponent extends BasicModal implements OnInit {

   public firstName = new UntypedFormControl();
   public lastName = new UntypedFormControl();
   public resume = new UntypedFormControl();

   constructor(
      public dialogRef: MatDialogRef<SeriesModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { parent: Category | Library, author: Author },
      public dataService: DataService) {
      super();
      if (data.author) {
         this.isNew = false;
         this.by = data.author.by;
         this.id = data.author.id;
         this.parentId = data.author.parentId;
         this.firstName.setValue(data.author.firstName);
         this.lastName.setValue(data.author.lastName);
         this.resume.setValue(data.author.resume);
      } else {
         this.isNew = true;
         this.id = uuidv4();
         this.by = data.parent.by;
         this.parentId = data.parent.id;
         this.firstName.setValue('');
         this.lastName.setValue('');
         this.resume.setValue('');
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

   protected formToData(): Author {
      return {
         id: this.id,
         by: this.by,
         parentId: this.parentId,
         resume: this.resume.value,
         firstName: this.firstName.value,
         lastName: this.lastName.value
      };
   }
}
