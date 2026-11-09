import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BoardGameCategoryDetailsComponent} from './board-game-category-details.component';

describe('BoardGameCategoryDetailsComponent', () => {
  let component: BoardGameCategoryDetailsComponent;
  let fixture: ComponentFixture<BoardGameCategoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BoardGameCategoryDetailsComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardGameCategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
