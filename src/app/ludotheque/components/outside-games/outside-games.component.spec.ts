import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OutsideGamesComponent} from './outside-games.component';

describe('OutsideGamesComponent', () => {
  let component: OutsideGamesComponent;
  let fixture: ComponentFixture<OutsideGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutsideGamesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutsideGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
