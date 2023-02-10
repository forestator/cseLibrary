import {ViewBy} from "src/app/models/author.model";

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
