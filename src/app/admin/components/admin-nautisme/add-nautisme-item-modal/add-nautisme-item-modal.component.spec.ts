import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddNautismeItemModalComponent} from './add-nautisme-item-modal.component';

describe('AddNautismeItemModalComponent', () => {
  let component: AddNautismeItemModalComponent;
  let fixture: ComponentFixture<AddNautismeItemModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [AddNautismeItemModalComponent]
});
    fixture = TestBed.createComponent(AddNautismeItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
