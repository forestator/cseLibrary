import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BoardGameToFilterComponent} from './board-game-to-filter.component';

describe('BoardGameToFilterComponent', () => {
  let component: BoardGameToFilterComponent;
  let fixture: ComponentFixture<BoardGameToFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardGameToFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardGameToFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
