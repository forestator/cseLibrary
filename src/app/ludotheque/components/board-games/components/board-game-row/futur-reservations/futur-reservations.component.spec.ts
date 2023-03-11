import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FuturReservationsComponent} from './futur-reservations.component';

describe('FuturReservationsComponent', () => {
  let component: FuturReservationsComponent;
  let fixture: ComponentFixture<FuturReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuturReservationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuturReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
