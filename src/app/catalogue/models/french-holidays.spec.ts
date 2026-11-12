import moment from 'moment';
import {isFrenchPublicHoliday} from './french-holidays';

describe('isFrenchPublicHoliday', () => {
  const holiday = (date: string) => isFrenchPublicHoliday(moment(date));

  it('knows the fixed holidays', () => {
    ['2026-01-01', '2026-05-01', '2026-05-08', '2026-07-14', '2026-08-15', '2026-11-01', '2026-11-11', '2026-12-25']
      .forEach(date => expect(holiday(date)).withContext(date).toBeTrue());
  });

  it('knows the holidays that follow Easter', () => {
    // Easter: 2026-04-05, 2027-03-28, 2025-04-20, 2024-03-31.
    expect(holiday('2026-04-06')).toBeTrue();
    expect(holiday('2026-05-14')).toBeTrue();
    expect(holiday('2026-05-25')).toBeTrue();
    expect(holiday('2027-03-29')).toBeTrue();
    expect(holiday('2025-04-21')).toBeTrue();
    expect(holiday('2024-04-01')).toBeTrue();
  });

  it('does not flag ordinary days nor Easter Sunday itself', () => {
    expect(holiday('2026-11-16')).toBeFalse();
    expect(holiday('2026-04-05')).toBeFalse();
    expect(holiday('2026-04-07')).toBeFalse();
  });
});
