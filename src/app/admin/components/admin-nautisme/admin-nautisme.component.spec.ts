import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminNautismeComponent} from './admin-nautisme.component';

describe('AdminNautismeComponent', () => {
  let component: AdminNautismeComponent;
  let fixture: ComponentFixture<AdminNautismeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminNautismeComponent]
    });
    fixture = TestBed.createComponent(AdminNautismeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
