import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OutsideGameRowComponent} from './outside-game-row.component';

describe('OutsideGameRowComponent', () => {
  let component: OutsideGameRowComponent;
  let fixture: ComponentFixture<OutsideGameRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutsideGameRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutsideGameRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
