import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BorrowGamesComponent} from './borrow-games.component';

describe('BorrowGamesComponent', () => {
  let component: BorrowGamesComponent;
  let fixture: ComponentFixture<BorrowGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BorrowGamesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
