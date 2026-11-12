import moment from 'moment';
import {BiblioUtils} from './biblio-utils';

describe('BiblioUtils.nextComission', () => {
  const next = (date: string) => BiblioUtils.nextComission(moment(date)).format('ddd YYYY-MM-DD');

  it('keeps a Tuesday or Thursday as it is', () => {
    expect(next('2026-11-10T15:00')).toBe('Tue 2026-11-10');
    expect(next('2026-11-12T08:00')).toBe('Thu 2026-11-12');
  });

  it('moves a Wednesday to Thursday', () => {
    expect(next('2026-11-11T10:00')).toBe('Thu 2026-11-12');
  });

  it('moves Friday to Sunday onto next Tuesday', () => {
    expect(next('2026-11-13T10:00')).toBe('Tue 2026-11-17');
    expect(next('2026-11-15T10:00')).toBe('Tue 2026-11-17');
  });

  it('moves a Monday to Tuesday', () => {
    expect(next('2026-11-16T10:00')).toBe('Tue 2026-11-17');
  });
});
