import {Component, Inject, ChangeDetectionStrategy} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {StorageUploadService} from '../../../../services/firebase/storage-upload.service';
import {FileUpload} from '../../../../models/fileUpload.model';
import {NautismeDatabaseService} from '../../../../nautisme/services/nautisme-database.service';
import {NautismeItem, NautismeStatus} from '../../../../nautisme/models/nautisme.model';
import {ConfirmationModal} from '../../confirmation-modal/confirmation-modal.component';
import {take} from 'rxjs';

@Component({
    selector: 'app-add-nautisme-item-modal',
    templateUrl: './add-nautisme-item-modal.component.html',
    styleUrls: ['./add-nautisme-item-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddNautismeItemModalComponent {

  nautismeItemForm: FormGroup;
  readonly defaultNautImage = 'https://res.cloudinary.com/seo9axkp/image/upload/assets/nautismeItems/nautismeDefaultImage';

  constructor(
    public dialogRef: MatDialogRef<AddNautismeItemModalComponent>,
    private dialog: MatDialog,
    public fb: FormBuilder,
    private nautismeDatabaseService: NautismeDatabaseService,
    private uploadService: StorageUploadService,
    @Inject(MAT_DIALOG_DATA) public data: {
      items: Array<NautismeItem>, selectedItem?: NautismeItem
    },
  ) {
    this.nautismeItemForm = this.initForm(this.data.selectedItem);
    console.log(this.nautismeItemForm);
  }

  private initForm(item?: NautismeItem): FormGroup {
    const uniqRef: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const exist = this.data.items.some(item => item.id === control.value);
      const edit = this.data?.selectedItem?.id === control.value;
      return (exist && !edit) ? {exist: true} : null;
    };

    return this.fb.group({
      ...item,
      id: this.fb.control(item?.id, [Validators.required, uniqRef]),
      name: this.fb.control(item?.name, Validators.required),
      status: this.fb.control(item?.status ?? NautismeStatus.AVAILABLE, Validators.required),
      description: this.fb.control(item?.description),
    });
  }

  addNautItem() {
    if (this.nautismeItemForm.valid) {
      this.nautismeDatabaseService.addNautismeItem(this.nautismeItemForm.value);
      this.cancel();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  upload(fileUpload: FileUpload) {
    if (this.nautismeItemForm.valid) {
      this.uploadService.uploadNautCover(fileUpload, this.nautismeItemForm.value as NautismeItem);
    }
  }

  deleteItem(selectedItem: NautismeItem) {
    const dialogRef = this.dialog.open(ConfirmationModal, {
      maxWidth: "400px",
      data: {confirmText: `Veuillez confirmer la supression de : ${selectedItem.name}`}
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(async dialogResult => {
      if (dialogResult) {
        await this.nautismeDatabaseService.delete(selectedItem);
        this.cancel();
      }
    });
  }
}
