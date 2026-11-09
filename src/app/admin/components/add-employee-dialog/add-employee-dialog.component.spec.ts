import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialogRef} from '@angular/material/dialog';

import {AddEmployeeDialogComponent} from './add-employee-dialog.component';

describe('AddEmployeeDialogComponent', () => {
  let component: AddEmployeeDialogComponent;
  let fixture: ComponentFixture<AddEmployeeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AddEmployeeDialogComponent],
      providers: [{provide: MatDialogRef, useValue: {close: () => undefined}}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmployeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
