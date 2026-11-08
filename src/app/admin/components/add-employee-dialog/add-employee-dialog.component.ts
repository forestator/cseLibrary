import {Component, Inject, ChangeDetectionStrategy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';

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
    standalone: false
})
export class AddEmployeeDialogComponent {
  userFormGroup: FormGroup<CseUserForm>;

  constructor(
    public dialogRef: MatDialogRef<AddEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
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
