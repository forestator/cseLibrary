import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {TitleCasePipe} from '@angular/common';
import {firstValueFrom} from 'rxjs';
import {CatalogueItem} from '../../../../catalogue/models/catalogue-item.model';
import {CommissionConfig} from '../../../../catalogue/models/commission-config.model';
import {CatalogueRepositories} from '../../../../catalogue/services/catalogue-repositories.service';
import {UploadFormComponent} from '../../../../common/components/upload-form/upload-form.component';
import {FileUpload} from '../../../../models/fileUpload.model';
import {StorageUploadService} from '../../../../services/firebase/storage-upload.service';
import {ConfirmationData, ConfirmationModal} from '../../confirmation-modal/confirmation-modal.component';

export interface CatalogueItemDialogData {
  config: CommissionConfig;
  items: CatalogueItem[];
  selectedItem?: CatalogueItem;
}

@Component({
  selector: 'app-catalogue-item-dialog',
  templateUrl: './catalogue-item-dialog.html',
  styleUrl: './catalogue-item-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogTitle, MatDialogContent, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatSelect,
    MatOption, MatButtonToggleGroup, MatButtonToggle, UploadFormComponent, MatDialogActions, MatButton,
    TitleCasePipe, MatIcon, MatError],
})
export class CatalogueItemDialog {
  private readonly dialogRef = inject<MatDialogRef<CatalogueItemDialog>>(MatDialogRef);
  private readonly dialog = inject(MatDialog);
  private readonly uploadService = inject(StorageUploadService);
  protected readonly data = inject<CatalogueItemDialogData>(MAT_DIALOG_DATA);

  private readonly repository = inject(CatalogueRepositories).of(this.data.config);
  protected readonly config = this.data.config;
  protected readonly adminConfig = this.data.config.admin;
  protected readonly selectedItem = this.data.selectedItem;

  protected readonly form = new FormGroup({
    id: new FormControl(this.selectedItem?.id ?? '', {
      nonNullable: true,
      validators: [Validators.required, (control: AbstractControl) => this.uniqueId(control)],
    }),
    name: new FormControl(this.selectedItem?.name ?? '', {nonNullable: true, validators: Validators.required}),
    categoryId: new FormControl(this.selectedItem?.categoryId ?? '', {
      nonNullable: true,
      validators: this.config.categories ? Validators.required : [],
    }),
    status: new FormControl(this.selectedItem?.status ?? 'AVAILABLE', {
      nonNullable: true,
      validators: Validators.required,
    }),
    description: new FormControl<string | null>(this.selectedItem?.description ?? null),
  });

  private readonly formStatus = toSignal(this.form.statusChanges, {initialValue: this.form.status});
  protected readonly invalid = computed(() => this.formStatus() !== 'VALID');
  protected readonly coverPreview = this.selectedItem?.cover ?? this.config.defaultImage;

  protected save() {
    if (this.form.valid) {
      this.repository.add(this.currentItem());
      this.cancel();
    }
  }

  protected cancel() {
    this.dialogRef.close();
  }

  protected upload(fileUpload: FileUpload) {
    if (this.form.valid) {
      this.uploadService.uploadItemCover(this.config, fileUpload, this.currentItem());
    }
  }

  protected async remove(item: CatalogueItem) {
    const confirmation = this.dialog.open(ConfirmationModal, {
      maxWidth: '400px',
      data: {
        title: 'Supprimer cet élément ?',
        confirmText: `Veuillez confirmer la suppression de : ${item.name}`,
        confirmLabel: 'Supprimer',
      } satisfies ConfirmationData
    });
    if (await firstValueFrom(confirmation.afterClosed())) {
      await this.repository.remove(item);
      this.cancel();
    }
  }

  private currentItem(): CatalogueItem {
    return {...this.selectedItem, ...this.form.getRawValue()};
  }

  private uniqueId(control: AbstractControl): ValidationErrors | null {
    const exists = this.data.items.some(item => item.id === control.value);
    return exists && this.selectedItem?.id !== control.value ? {exist: true} : null;
  }
}
