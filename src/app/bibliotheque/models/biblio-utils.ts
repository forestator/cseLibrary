import moment, {Moment} from 'moment';

/** ISO weekdays of the library sessions (Tuesday and Thursday). */
const LIBRARY_ISO_WEEKDAYS: ReadonlyArray<number> = [2, 4];
const DAYS_PER_WEEK = 7;

export class BiblioUtils {

  /** Today when it is a session day, otherwise the next one. */
  static nextComission(now: Moment = moment()): Moment {
    for (let offset = 0; offset < DAYS_PER_WEEK; offset++) {
      const day = now.clone().startOf('day').add(offset, 'days');
      if (LIBRARY_ISO_WEEKDAYS.includes(day.isoWeekday())) {
        return day;
      }
    }
    throw new Error('No library session day found');
  }
}
