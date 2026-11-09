import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormControl, FormRecord, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {BookCoverPipe} from '../../../pipes/book-cover.pipe';
import {DialogForm, FormDialogData, FormValues} from './form-dialog.model';

/** Generic edition dialog driven by a field configuration; closes with the form values or nothing. */
@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatDialogModule, MatInputModule, MatSelectModule, MatButton, MatIcon, BookCoverPipe],
})
export class FormDialogComponent {
  private readonly dialogRef = inject<MatDialogRef<FormDialogComponent, FormValues>>(MatDialogRef);
  protected readonly data = inject<FormDialogData>(MAT_DIALOG_DATA);

  protected readonly form: DialogForm = new FormRecord(
    Object.fromEntries(
      this.data.fields.map(field => [
        field.key,
        new FormControl(this.data.values[field.key] ?? '', {nonNullable: true}),
      ])
    )
  );

  private readonly values = toSignal(this.form.valueChanges, {initialValue: this.form.getRawValue()});

  protected readonly heading = computed(() => {
    const keys = this.data.titleKeys;
    if (!keys) {
      return this.data.title;
    }
    const values = this.values();
    return `${this.data.title} : ${keys.map(key => values[key]).join(' ')}`;
  });

  protected readonly coverName = computed(() => {
    const key = this.data.cover?.key;
    return key ? this.values()[key] : undefined;
  });

  protected save(): void {
    this.dialogRef.close(this.form.getRawValue());
  }

  protected cancel(): void {
    this.dialogRef.close();
  }
}
