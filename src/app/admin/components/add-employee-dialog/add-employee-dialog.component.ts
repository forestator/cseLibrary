import {ChangeDetectionStrategy, Component, effect, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';

export interface NewEmployee {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-add-employee-dialog',
  templateUrl: './add-employee-dialog.component.html',
  styleUrl: './add-employee-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogTitle, ReactiveFormsModule, MatDialogContent, MatFormField, MatLabel, MatInput, MatDialogActions,
    MatButton, MatDialogClose],
})
export class AddEmployeeDialogComponent {
  private readonly dialogRef = inject<MatDialogRef<AddEmployeeDialogComponent, NewEmployee>>(MatDialogRef);

  protected readonly userFormGroup = new FormGroup({
    firstName: new FormControl('', {nonNullable: true, validators: Validators.required}),
    lastName: new FormControl('', {nonNullable: true, validators: Validators.required}),
    email: new FormControl('', {nonNullable: true, validators: Validators.required}),
  });

  private readonly formValue = toSignal(this.userFormGroup.valueChanges);

  constructor() {
    // Suggest the company address until the user edits the email field by hand.
    effect(() => {
      const {firstName, lastName} = this.formValue() ?? {};
      const email = this.userFormGroup.controls.email;
      if (firstName && lastName && email.untouched) {
        email.patchValue(`${firstName.toLowerCase()}.${lastName.toLowerCase()}@harmonicinc.com`,
          {emitEvent: false, onlySelf: true});
      }
    });
  }

  protected cancel() {
    this.dialogRef.close();
  }
}
