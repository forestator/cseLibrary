import {TestBed} from '@angular/core/testing';

import {FilterBoardGamesService} from './filter-board-games.service';

describe('FilterBoardGamesService', () => {
  let service: FilterBoardGamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterBoardGamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
