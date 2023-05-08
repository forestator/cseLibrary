import {Moment} from 'moment/moment';
import moment from 'moment';

export class BiblioUtils {

  static nextComission(): Moment {
    const currentDate: Moment = moment();
    if (currentDate.day() > 4) {
      currentDate.day(2);
      currentDate.add(1, 'week');
    } else if (currentDate.day() !== 2 || currentDate.day() !== 4) {
      currentDate.day(currentDate.day() === 3 ? 4 : 2);
    }
    return currentDate;
  }
}
