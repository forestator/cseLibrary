import moment, {Moment} from 'moment';

const FIXED_HOLIDAYS: ReadonlyArray<string> = [
  '01-01', '05-01', '05-08', '07-14', '08-15', '11-01', '11-11', '12-25',
];

/** Easter Sunday, by the anonymous Gregorian algorithm (Meeus/Jones/Butcher). */
function easterSunday(year: number): Moment {
  const century = Math.floor(year / 100);
  const yearInCentury = year % 100;
  const leapCorrection = Math.floor(century / 4);
  const moonCorrection = Math.floor((century + 8) / 25);
  const moonOffset = Math.floor((century - moonCorrection + 1) / 3);
  const epact = (19 * (year % 19) + century - leapCorrection - moonOffset + 15) % 30;
  const weekdayOffset = (32 + 2 * (century % 4) + 2 * Math.floor(yearInCentury / 4) - epact - (yearInCentury % 4)) % 7;
  const correction = Math.floor(((year % 19) + 11 * epact + 22 * weekdayOffset) / 451);
  const monthAndDay = epact + weekdayOffset - 7 * correction + 114;
  return moment({year, month: Math.floor(monthAndDay / 31) - 1, day: (monthAndDay % 31) + 1});
}

const DAYS_FROM_EASTER: ReadonlyArray<number> = [
  1, // lundi de Pâques
  39, // Ascension
  50, // lundi de Pentecôte
];

/** Public holidays of metropolitan France. */
export function isFrenchPublicHoliday(day: Moment): boolean {
  if (FIXED_HOLIDAYS.includes(day.format('MM-DD'))) {
    return true;
  }
  const easter = easterSunday(day.year());
  return DAYS_FROM_EASTER.some(offset => easter.clone().add(offset, 'days').isSame(day, 'day'));
}
