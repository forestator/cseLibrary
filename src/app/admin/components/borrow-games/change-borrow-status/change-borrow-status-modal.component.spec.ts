import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChangeBorrowStatusModalComponent} from './change-borrow-status-modal.component';

describe('ChangeBorrowStatusComponent', () => {
  let component: ChangeBorrowStatusModalComponent;
  let fixture: ComponentFixture<ChangeBorrowStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeBorrowStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeBorrowStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
