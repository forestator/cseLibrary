import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BorrowPlanningModalComponent} from './borrow-planning-modal.component';

describe('BorrowPlanningModalComponent', () => {
  let component: BorrowPlanningModalComponent;
  let fixture: ComponentFixture<BorrowPlanningModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BorrowPlanningModalComponent]
    });
    fixture = TestBed.createComponent(BorrowPlanningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
