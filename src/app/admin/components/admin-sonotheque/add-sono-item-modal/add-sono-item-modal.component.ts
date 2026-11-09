import {Component, Inject, ChangeDetectionStrategy} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import {StorageUploadService} from "../../../../services/firebase/storage-upload.service";
import {FileUpload} from "../../../../models/fileUpload.model";
import {SonoCategory, SonoItem, SonoStatus} from "../../../../sonotheque/models/sono.model";
import {SonoDatabaseService} from "../../../../sonotheque/services/sono-database.service";
import {ConfirmationModal} from '../../confirmation-modal/confirmation-modal.component';
import {take} from 'rxjs';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/autocomplete';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { MatDivider } from '@angular/material/divider';
import { UploadFormComponent } from '../../../../common/components/upload-form/upload-form.component';
import { MatButton } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-add-sono-item-modal',
    templateUrl: './add-sono-item-modal.component.html',
    styleUrls: ['./add-sono-item-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatSelect, MatOption, MatButtonToggleGroup, MatButtonToggle, MatDivider, UploadFormComponent, MatDialogActions, MatButton, TitleCasePipe]
})
export class AddSonoItemModalComponent {

  sonoItemForm: FormGroup;
  categoryOptions: string[] = Object.values(SonoCategory);
  readonly defaultImageForSonoItem = 'https://res.cloudinary.com/seo9axkp/image/upload/assets/sonoItems/defaultSonoIItem';

  constructor(
    public dialogRef: MatDialogRef<AddSonoItemModalComponent>,
    public fb: FormBuilder,
    private dialog: MatDialog,
    private sonoDatabaseService: SonoDatabaseService,
    private uploadService: StorageUploadService,
    @Inject(MAT_DIALOG_DATA) public data: {
      items: Array<SonoItem>, selectedItem?: SonoItem
    },
  ) {
    this.sonoItemForm = this.initForm(this.data.selectedItem);
    console.log(this.sonoItemForm);
  }

  private initForm(item?: SonoItem): FormGroup {
    const uniqRef: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const exist = this.data.items.some(item => item.id === control.value);
      const edit = this.data?.selectedItem?.id === control.value;
      return (exist && !edit) ? {exist: true} : null;
    };

    return this.fb.group({
      ...item,
      id: this.fb.control(item?.id, [Validators.required, uniqRef]),
      name: this.fb.control(item?.name, Validators.required),
      category: this.fb.control(item?.category, Validators.required),
      status: this.fb.control(item?.status ?? SonoStatus.AVAILABLE, Validators.required),
      description: this.fb.control(item?.description),
    });
  }

  addSonoItem() {
    if (this.sonoItemForm.valid) {
      this.sonoDatabaseService.addSonoItem(this.sonoItemForm.value);
      this.cancel();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  upload(fileUpload: FileUpload) {
    if (this.sonoItemForm.valid) {
      this.uploadService.uploadSonoItemCover(fileUpload, this.sonoItemForm.value as SonoItem);
    }
  }

  deleteItem(selectedItem: SonoItem) {
    const dialogRef = this.dialog.open(ConfirmationModal, {
      maxWidth: "400px",
      data: {confirmText: `Veuillez confirmer la supression de : ${selectedItem.name}`}
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(async dialogResult => {
      if (dialogResult) {
        await this.sonoDatabaseService.delete(selectedItem);
        this.cancel();
      }
    });
  }
}
