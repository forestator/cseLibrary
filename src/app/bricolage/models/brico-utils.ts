import {BddTools, Tool} from './bricolage.model';
import {Moment} from "moment";
import moment from "moment/moment";

export class BricoUtils {
  static bddToolToTool(bddToll: BddTools, categoryId: string): Array<Tool> {
    if (bddToll) {
      return Object.keys(bddToll).map(
        (key) => Object.assign({id: key, categoryId}, bddToll[key])
      );
    } else {
      return [];
    }
  }

  static nextComissionBricolage(): Moment {
    const currentDate: Moment = moment();
    if (currentDate.day() === 0) {
      currentDate.day(1);
    } else if (currentDate.day() !== 1) {
      currentDate.day(1);
      currentDate.add(1, 'week');
    }
    return currentDate;
  }
}
