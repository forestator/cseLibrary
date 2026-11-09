import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminSonothequeComponent} from './admin-sonotheque.component';

describe('AdminSonothequeComponent', () => {
  let component: AdminSonothequeComponent;
  let fixture: ComponentFixture<AdminSonothequeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdminSonothequeComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(AdminSonothequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
