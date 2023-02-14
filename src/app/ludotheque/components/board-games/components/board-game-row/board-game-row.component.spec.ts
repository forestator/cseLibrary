import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BoardGameRowComponent} from './board-game-row.component';

describe('BoardGameRowComponent', () => {
  let component: BoardGameRowComponent;
  let fixture: ComponentFixture<BoardGameRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardGameRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardGameRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
