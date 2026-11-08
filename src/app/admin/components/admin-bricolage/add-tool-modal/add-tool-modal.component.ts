import {Component, Inject} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {BricoCategories, Tool, ToolStatus} from '../../../../bricolage/models/bricolage.model';
import {BricolageDatabaseService} from '../../../../bricolage/services/bricolage-database.service';
import {FileUpload} from "../../../../models/fileUpload.model";
import {StorageUploadService} from '../../../../services/firebase/storage-upload.service';
import {ConfirmationModal} from '../../confirmation-modal/confirmation-modal.component';
import {take} from 'rxjs';

@Component({
  selector: 'app-add-tool-modal',
  templateUrl: './add-tool-modal.component.html',
  styleUrls: ['./add-tool-modal.component.scss']
})
export class AddToolModalComponent {

  toolForm: FormGroup;
  categoryOptions: string[] = Object.values(BricoCategories);
  readonly defaultImageForTool = 'https://firebasestorage.googleapis.com/v0/b/cseh-50966.appspot.com/o/assets%2Ftools%2Fcovers%2FdefaultTool.jpg?alt=media&token=165e5ad1-3d3f-477a-a7d7-72cf49c8eaa4';

  constructor(
    public dialogRef: MatDialogRef<AddToolModalComponent>,
    private dialog: MatDialog,
    public fb: FormBuilder,
    private bricolageDatabaseService: BricolageDatabaseService,
    private uploadService: StorageUploadService,
    @Inject(MAT_DIALOG_DATA) public data: {
      tools: Array<Tool>, selectedTool?: Tool
    },
  ) {
    this.toolForm = this.initForm(this.data.selectedTool);
  }

  private initForm(tool?: Tool): FormGroup {
    const uniqRef: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const exist = this.data.tools.some(tool => tool.id === control.value);
      const edit = this.data?.selectedTool?.id === control.value;
      return (exist && !edit) ? {exist: true} : null;
    };

    return this.fb.group({
      ...tool,
      id: this.fb.control(tool?.id, [Validators.required, uniqRef]),
      name: this.fb.control(tool?.name, Validators.required),
      categoryId: this.fb.control(tool?.categoryId, Validators.required),
      status: this.fb.control(tool?.status ?? ToolStatus.AVAILABLE, Validators.required),
      description: this.fb.control(tool?.description),
    });
  }

  addTool() {
    if (this.toolForm.valid) {
      this.bricolageDatabaseService.addTool(this.toolForm.value);
      this.cancel();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  upload(fileUpload: FileUpload) {
    if (this.toolForm.valid) {
      this.uploadService.uploadToolCover(fileUpload, this.toolForm.value as Tool);
    }
  }

  deleteTool(selectedItem: Tool) {
    const dialogRef = this.dialog.open(ConfirmationModal, {
      maxWidth: "400px",
      data: {confirmText: `Veuillez confirmer la supression de : ${selectedItem.name}`}
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(async dialogResult => {
      if (dialogResult) {
        await this.bricolageDatabaseService.delete(selectedItem);
        this.cancel();
      }
    });
  }
}
