import {TestBed} from '@angular/core/testing';

import {BricolageDatabaseService} from './bricolage-database.service';

describe('BricolageDatabaseService', () => {
  let service: BricolageDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BricolageDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
