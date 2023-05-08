import {SonoBddItems, SonoCategory, SonoItem, SonoStatus} from "./sono.model";
import {Moment} from 'moment';
import moment from 'moment/moment';

export class SonoUtils {
  public static BddItemToSonoItem(sonoBddItem: SonoBddItems, category: SonoCategory): SonoItem[] {
    if (sonoBddItem) {
      return Object.keys(sonoBddItem).map(
        (key) => Object.assign({
          id: key,
          category,
          status: sonoBddItem[key]?.status ?? SonoStatus.AVAILABLE
        }, sonoBddItem[key])
      );
    } else {
      return [];
    }
  }

  static nextComission(): Moment {
    const currentDate: Moment = moment();
    currentDate.day(4);
    if (currentDate.day() > 4) {
      currentDate.add(1, 'week');
    }
    return currentDate;
  }
}
