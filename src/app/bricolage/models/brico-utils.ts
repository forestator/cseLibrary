import {BddTools, Tool} from './bricolage.model';

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
}
