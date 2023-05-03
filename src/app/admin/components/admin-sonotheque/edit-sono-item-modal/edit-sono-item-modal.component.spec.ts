import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditSonoItemModalComponent} from './edit-sono-item-modal.component';

describe('EditSonoItemModalComponent', () => {
  let component: EditSonoItemModalComponent;
  let fixture: ComponentFixture<EditSonoItemModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSonoItemModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSonoItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
