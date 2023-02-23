import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LudoBorrowTableComponent} from './ludo-borrow-table.component';

describe('LudoBorrowTableComponent', () => {
  let component: LudoBorrowTableComponent;
  let fixture: ComponentFixture<LudoBorrowTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LudoBorrowTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LudoBorrowTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
