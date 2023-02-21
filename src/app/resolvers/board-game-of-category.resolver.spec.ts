import {TestBed} from '@angular/core/testing';

import {BoardGameOfCategoryResolver} from './board-game-of-category.resolver';

describe('BoardGameOfCategoryResolver', () => {
  let resolver: BoardGameOfCategoryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(BoardGameOfCategoryResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
