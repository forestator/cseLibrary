import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PlanningEmpruntsComponent} from './planning-emprunts.component';

describe('PlanningEmpruntsComponent', () => {
  let component: PlanningEmpruntsComponent;
  let fixture: ComponentFixture<PlanningEmpruntsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningEmpruntsComponent]
    });
    fixture = TestBed.createComponent(PlanningEmpruntsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
