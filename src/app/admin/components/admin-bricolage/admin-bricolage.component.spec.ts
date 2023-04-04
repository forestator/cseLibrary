import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminBricolageComponent} from './admin-bricolage.component';

describe('AdminBricolageComponent', () => {
  let component: AdminBricolageComponent;
  let fixture: ComponentFixture<AdminBricolageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminBricolageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBricolageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
