import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {ConfirmationModal} from './confirmation-modal.component';

describe('ConfirmReturnAllModalComponent', () => {
  let component: ConfirmationModal;
  let fixture: ComponentFixture<ConfirmationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ConfirmationModal],
      providers: [{provide: MatDialogRef, useValue: {close: () => undefined}}, {provide: MAT_DIALOG_DATA, useValue: {confirmText: 'Confirmer ?'}}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
