import {BorrowedByUserPipe} from './borrowed-by-user.pipe';

describe('BorrowedByUserPipe', () => {
  it('create an instance', () => {
    const pipe = new BorrowedByUserPipe();
    expect(pipe).toBeTruthy();
  });
});
