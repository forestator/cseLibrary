import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatCheckbox} from '@angular/material/checkbox';
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatSelect, MatOption} from '@angular/material/select';
import {MatSnackBar} from '@angular/material/snack-bar';
import {firstValueFrom, startWith} from 'rxjs';
import {UploadFormComponent} from '../../common/components/upload-form/upload-form.component';
import {FileUpload} from '../../models/fileUpload.model';
import {AdminCollection, AdminItem} from '../catalogue/admin-collection.model';
import {ConfirmationData, ConfirmationModal} from '../components/confirmation-modal/confirmation-modal.component';
import {isKeyTaken, toFormValues} from './admin-form';
import {AdminField, AdminFormValue, AdminFormValues} from './admin-form.model';

export interface AdminItemDialogData {
  collection: AdminCollection;
  /** The item to edit; absent when adding. */
  item?: AdminItem;
}

/** A field with the name of its form control: a dotted key such as `dimensions.longueur` is not a valid control name. */
interface FormField extends AdminField {
  name: string;
}

const controlName = (key: string): string => key.replaceAll('.', '__');

/**
 * The one form to add or edit an object of any collection. What it shows comes from the collection's
 * field list; saving, deleting and the cover upload go through the collection too.
 */
@Component({
  selector: 'app-admin-item-dialog',
  templateUrl: './admin-item-dialog.html',
  styleUrl: './admin-item-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, ReactiveFormsModule, MatFormField, MatLabel, MatInput,
    MatSelect, MatOption, MatButtonToggleGroup, MatButtonToggle, MatCheckbox, MatButton, MatIconButton, MatIcon, MatError,
    MatProgressBar, UploadFormComponent],
})
export class AdminItemDialog {
  private readonly dialogRef = inject<MatDialogRef<AdminItemDialog>>(MatDialogRef);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly data = inject<AdminItemDialogData>(MAT_DIALOG_DATA);

  protected readonly collection = this.data.collection;
  protected readonly item = this.data.item;
  private readonly definition = this.collection.form;

  protected readonly title = `${this.item ? 'Modifier' : 'Ajouter'} ${this.definition.noun}`;
  protected readonly sections = this.definition.sections.map(section => ({
    ...section,
    fields: section.fields.map((field): FormField => ({...field, name: controlName(field.key)})),
  }));
  private readonly fields = this.sections.flatMap(section => section.fields);

  private readonly existingKeys = signal<ReadonlyArray<string>>([]);
  protected readonly form = this.createForm();

  private readonly formStatus = toSignal(this.form.statusChanges.pipe(startWith(this.form.status)), {initialValue: this.form.status});
  private readonly formValue = toSignal(this.form.valueChanges.pipe(startWith(this.form.getRawValue())), {initialValue: this.form.getRawValue()});

  protected readonly invalid = computed(() => this.formStatus() !== 'VALID');
  protected readonly errors = computed<Record<string, string | undefined>>(() => {
    const keyField = this.definition.keyField;
    if (!keyField) {
      return {};
    }
    const key = String(this.formValue()[controlName(keyField)] ?? '').trim();
    return {[controlName(keyField)]: key && isKeyTaken(key, this.existingKeys(), this.item?.id) ? 'Cette référence existe déjà' : undefined};
  });

  // The cover is uploaded as soon as it is chosen but only written, with the rest, on Enregistrer.
  protected readonly uploadedCover = signal<string | undefined>(undefined);
  protected readonly coverPreview = computed(() => this.uploadedCover() ?? this.item?.cover);
  protected readonly uploadProgress = signal<number | undefined>(undefined);
  protected readonly uploadDisabled = computed(() => {
    const value = this.formValue();
    return !['name', 'category', 'categoryId'].filter(key => controlName(key) in value)
      .every(key => String(value[controlName(key)] ?? '').trim());
  });

  protected readonly saving = signal(false);
  private readonly assistFound = signal<Record<string, unknown>>({});
  protected readonly assistBusy = signal(false);
  protected readonly assistFillDisabled = computed(() => {
    const value = this.formValue();
    return !String(value['name'] ?? '').trim() || !String(value['id'] ?? '').trim();
  });

  constructor() {
    void this.collection.existingKeys().then(keys => {
      this.existingKeys.set(keys);
      if (this.definition.keyField) {
        this.form.controls[controlName(this.definition.keyField)].updateValueAndValidity();
      }
    });
  }

  protected async save(): Promise<void> {
    if (this.invalid() || this.saving()) {
      return;
    }
    this.saving.set(true);
    try {
      await this.collection.save({
        values: this.currentValues(),
        cover: this.uploadedCover(),
        extra: this.assistFound(),
        original: this.item,
      });
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Unable to save the item', error);
      this.snackBar.open('Enregistrement impossible : vérifiez votre connexion et vos droits', 'Fermer', {duration: 8000});
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close();
  }

  protected async remove(): Promise<void> {
    const item = this.item;
    if (!item) {
      return;
    }
    const confirmation = this.dialog.open(ConfirmationModal, {
      maxWidth: '400px',
      data: {
        title: 'Supprimer cet élément ?',
        confirmText: `Veuillez confirmer la suppression de : ${item.name}`,
        confirmLabel: 'Supprimer',
      } satisfies ConfirmationData,
    });
    if (await firstValueFrom(confirmation.afterClosed())) {
      try {
        await this.collection.remove(item);
        this.dialogRef.close(true);
      } catch (error) {
        console.error('Unable to delete the item', error);
        this.snackBar.open('Suppression impossible : vérifiez votre connexion et vos droits', 'Fermer', {duration: 8000});
      }
    }
  }

  protected upload(fileUpload: FileUpload): void {
    this.uploadProgress.set(0);
    this.collection.uploadCover(fileUpload.file, this.currentValues()).subscribe({
      next: state => {
        this.uploadProgress.set(state.url ? undefined : state.progress);
        if (state.url) {
          this.uploadedCover.set(state.url);
        }
      },
      error: error => {
        console.error('Cover upload failed', error);
        this.uploadProgress.set(undefined);
        this.snackBar.open("L'envoi de l'image a échoué", 'Fermer', {duration: 6000});
      },
    });
  }

  protected async searchAssist(): Promise<void> {
    const assist = this.collection.assist;
    const name = String(this.form.controls['name']?.value ?? '').trim();
    if (!assist || !name) {
      return;
    }
    const id = await assist.pick(name);
    if (id) {
      this.form.controls['id'].setValue(id);
      await this.fillAssist();
    }
  }

  protected async fillAssist(): Promise<void> {
    const assist = this.collection.assist;
    if (!assist || this.assistBusy()) {
      return;
    }
    this.assistBusy.set(true);
    try {
      const found = await assist.fill(this.currentValues());
      this.form.patchValue(Object.fromEntries(Object.entries(found.values).map(([key, value]) => [controlName(key), value])));
      this.assistFound.update(previous => ({...previous, ...found.extra}));
    } finally {
      this.assistBusy.set(false);
    }
  }

  private currentValues(): AdminFormValues {
    const raw = this.form.getRawValue();
    return Object.fromEntries(this.fields.map(field => [field.key, raw[field.name]]));
  }

  private createForm(): FormGroup<Record<string, FormControl<AdminFormValue>>> {
    const initial: AdminFormValues = this.item
      ? (this.collection.initialValues?.(this.item) ?? toFormValues(this.item.source as unknown as Record<string, unknown>, this.fields))
      : {...toFormValues(undefined, this.fields), ...this.definition.defaults};
    const keyName = this.definition.keyField ? controlName(this.definition.keyField) : undefined;
    const controls = Object.fromEntries(this.fields.map(field => {
      const validators = [
        ...(field.required || (field.requiredWhenAdding && !this.item) ? [Validators.required] : []),
        ...(field.name === keyName ? [(control: AbstractControl): ValidationErrors | null => this.uniqueKey(control)] : []),
      ];
      return [field.name, new FormControl<AdminFormValue>(initial[field.key], {nonNullable: true, validators})];
    }));
    return new FormGroup(controls);
  }

  private uniqueKey(control: AbstractControl): ValidationErrors | null {
    const key = String(control.value ?? '').trim();
    return key && isKeyTaken(key, this.existingKeys(), this.item?.id) ? {exist: true} : null;
  }
}
