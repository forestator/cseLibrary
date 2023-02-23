import {TestBed} from '@angular/core/testing';

import {IsAllowedToWriteGuard} from './is-allowed-to-write.guard';

describe('IsAllowedToWriteGuard', () => {
  let guard: IsAllowedToWriteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsAllowedToWriteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
