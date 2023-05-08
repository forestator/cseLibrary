import {MomentToDatePipe} from './moment-to-date.pipe';

describe('MomentToDatePipe', () => {
  it('create an instance', () => {
    const pipe = new MomentToDatePipe();
    expect(pipe).toBeTruthy();
  });
});
