import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmReturnAllModalComponent} from './confirm-return-all-modal.component';

describe('ConfirmReturnAllModalComponent', () => {
  let component: ConfirmReturnAllModalComponent;
  let fixture: ComponentFixture<ConfirmReturnAllModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmReturnAllModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmReturnAllModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
