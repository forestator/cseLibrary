import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {map, Observable, take} from 'rxjs';
import {Library} from '../../models/author.model';
import {AllTools, BddTools, BricoCategories, Tool} from '../models/bricolage.model';
import {BricoUtils} from '../models/brico-utils';
import {FileUpload} from "../../models/fileUpload.model";

@Injectable({
  providedIn: 'root'
})
export class BricolageDatabaseService {

  bricolageLibrary$: Observable<Library>;
  allTools$: Observable<Tool[]>;

  constructor(private db: AngularFireDatabase) {
    this.bricolageLibrary$ = this.db.object<Library>('bricolage/library')
      .valueChanges().pipe(take(1));
    this.allTools$ = this.db.object<AllTools>('bricolage/tools').valueChanges().pipe(
      map(allCategoriesWithTools => {
        const allTools: Array<Tool> = [];
       Object.values(BricoCategories)
          .forEach(categoryId => {
            const bddToolOfCategory = allCategoriesWithTools[categoryId];
            const toolsOfCategory = BricoUtils.bddToolToTool(bddToolOfCategory, categoryId);
            allTools.push(...toolsOfCategory);
          });
        return allTools;
      })
    )
  }

  getBricoCategory(categoryId: string): Observable<Tool[]> {
    return this.db.object<BddTools>(`bricolage/tools/${categoryId}`).valueChanges().pipe(
      take(1),
      map((bddTools) => BricoUtils.bddToolToTool(bddTools, categoryId) as Array<Tool>)
    );
  }

  addTool(tool: Tool) {
    return this.db.object(`bricolage/tools/${tool.categoryId}/${tool.id}`).update(tool);
  }

  updateToolCover(tool: Tool, filteToUpload: FileUpload) {
    return this.db.object(`bricolage/tools/${tool.categoryId}/${tool.id}`)
      .update({cover: filteToUpload.url});
  }

  async delete(tool: Tool) {
    return this.db.object(`bricolage/tools/${tool.categoryId}/${tool.id}`)
      .remove();
  }
}
