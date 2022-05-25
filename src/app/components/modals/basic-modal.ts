import { MatDialogRef } from "@angular/material/dialog";
import { ViewBy } from "src/app/models/author.model";
import { CategoryModalComponent } from "./category-modal/category-modal.component";

export abstract class BasicModal {

   public isNew: boolean = false;
   public id!: string | undefined;
   public parentId!: string | undefined;
   public by!: ViewBy | undefined;

   constructor() {

   }

   abstract cancel(): void;
   abstract save(): void;
   protected abstract formToData(): any;
}
