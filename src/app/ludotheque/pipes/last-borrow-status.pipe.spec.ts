import {LastBorrowStatusPipe} from './last-borrow-status.pipe';

describe('LastBorrowStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new LastBorrowStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
