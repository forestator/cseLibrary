import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterBoardGamesComponent} from './filter-board-games.component';

describe('FilterBoardGamesComponent', () => {
  let component: FilterBoardGamesComponent;
  let fixture: ComponentFixture<FilterBoardGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterBoardGamesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterBoardGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
