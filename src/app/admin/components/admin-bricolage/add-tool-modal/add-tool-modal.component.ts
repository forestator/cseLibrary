import {Component, Inject} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BricoCategories, Tool} from '../../../../bricolage/models/bricolage.model';
import {BricolageDatabaseService} from '../../../../bricolage/services/bricolage-database.service';
import {FileUpload} from "../../../../models/fileUpload.model";

@Component({
  selector: 'app-add-tool-modal',
  templateUrl: './add-tool-modal.component.html',
  styleUrls: ['./add-tool-modal.component.scss']
})
export class AddToolModalComponent {

  toolForm: FormGroup;
  categoryOptions: string[] = Object.values(BricoCategories);
  readonly defaultImageForTool = 'https://firebasestorage.googleapis.com/v0/b/cseh-50966.appspot.com/o/assets%2Fbricolage%2F886a62acec77b09e8f37f72cb957da99%5B1%5D.jpg?alt=media&token=265aeac8-5453-4a36-9dba-ba8032564e7e';
  constructor(
    public dialogRef: MatDialogRef<AddToolModalComponent>,
    public fb: FormBuilder,
    private bricolageDatabaseService: BricolageDatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: {
      tools: Array<Tool>, selectedTool?: Tool
    },
  ) {
    this.toolForm = this.initForm(this.data.selectedTool);
  }

  private initForm(tool?: Tool): FormGroup {
    const uniqRef: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const exist = this.data.tools.some(game => game.id === control.value);
      const edit = this.data?.selectedTool?.id === control.value;
      return (exist && !edit) ? {exist: true} : null;
    };

    return this.fb.group({
      id: this.fb.control(tool?.id, [Validators.required, uniqRef]),
      name: this.fb.control(tool?.name, Validators.required),
      description: this.fb.control(tool?.description),
      categoryId: this.fb.control(tool?.categoryId, Validators.required),
    });
  }

  addTool() {
    if (this.toolForm.valid) {
      // todo
      this.cancel();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  upload(filteToUpload: FileUpload) {
    // todo
  }
}
