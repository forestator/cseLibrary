import {BddTools, Tool} from './bricolage.model';

export class BricoUtils {
  static bddToolToTool(bddToll: BddTools | null): Array<Tool> {
    if (bddToll) {
      return Object.keys(bddToll).map(
        (key) => Object.assign({id: key}, bddToll[key])
      );
    } else {
      return [];
    }
  }
}
