import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

interface CseUserForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
}

@Component({
    selector: 'app-add-employee-dialog',
    templateUrl: './add-employee-dialog.component.html',
    styleUrls: ['./add-employee-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDialogTitle, ReactiveFormsModule, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatInput, MatDialogActions, MatButton, MatDialogClose]
})
export class AddEmployeeDialogComponent {
  dialogRef = inject<MatDialogRef<AddEmployeeDialogComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);

  userFormGroup: FormGroup<CseUserForm>;

  constructor() {
    this.userFormGroup = new FormGroup<CseUserForm>({
      firstName: new FormControl<string>('', Validators.required),
      lastName: new FormControl<string>('', Validators.required),
      email: new FormControl<string>('', Validators.required)
    });
    this.userFormGroup.valueChanges.subscribe(formVal => {
      if (formVal.firstName && formVal.lastName && this.userFormGroup.get('email').untouched) {
        this.userFormGroup.get('email')
          .patchValue(`${formVal.firstName.toLowerCase()}.${formVal.lastName.toLowerCase()}@harmonicinc.com`,
            {emitEvent: false, onlySelf: true});
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
