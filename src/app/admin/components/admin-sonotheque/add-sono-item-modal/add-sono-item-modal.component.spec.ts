import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddSonoItemModalComponent} from './add-sono-item-modal.component';

describe('AddSonoItemModalComponent', () => {
  let component: AddSonoItemModalComponent;
  let fixture: ComponentFixture<AddSonoItemModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSonoItemModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSonoItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
