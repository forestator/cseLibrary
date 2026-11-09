import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditToolModalComponent} from './edit-tool-modal.component';

describe('EditToolModalComponent', () => {
  let component: EditToolModalComponent;
  let fixture: ComponentFixture<EditToolModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EditToolModalComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(EditToolModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
