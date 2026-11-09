import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditNautismeItemModalComponent} from './edit-nautisme-item-modal.component';

describe('EditNautismeItemModalComponent', () => {
  let component: EditNautismeItemModalComponent;
  let fixture: ComponentFixture<EditNautismeItemModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [EditNautismeItemModalComponent]
});
    fixture = TestBed.createComponent(EditNautismeItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
