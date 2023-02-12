import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChangeBorrowStatusComponent} from './change-borrow-status.component';

describe('ChangeBorrowStatusComponent', () => {
  let component: ChangeBorrowStatusComponent;
  let fixture: ComponentFixture<ChangeBorrowStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeBorrowStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeBorrowStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
