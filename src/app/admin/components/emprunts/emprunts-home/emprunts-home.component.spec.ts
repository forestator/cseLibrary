import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EmpruntsHomeComponent} from './emprunts-home.component';

describe('EmpruntsHomeComponent', () => {
  let component: EmpruntsHomeComponent;
  let fixture: ComponentFixture<EmpruntsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpruntsHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpruntsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
