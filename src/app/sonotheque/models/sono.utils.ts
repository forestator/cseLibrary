import {SonoBddItems, SonoCategory, SonoItem, SonoStatus} from "./sono.model";

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
}
