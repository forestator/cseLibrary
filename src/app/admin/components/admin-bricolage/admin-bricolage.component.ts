import {Component} from '@angular/core';
import {BricoCategories, Tool} from '../../../bricolage/models/bricolage.model';
import {Observable, take} from 'rxjs';
import {BricolageDatabaseService} from '../../../bricolage/services/bricolage-database.service';
import {MatDialog} from '@angular/material/dialog';
import {AddToolModalComponent} from './add-tool-modal/add-tool-modal.component';
import {EditToolModalComponent} from './edit-tool-modal/edit-tool-modal.component';

@Component({
    selector: 'app-admin-bricolage',
    templateUrl: './admin-bricolage.component.html',
    styleUrls: ['./admin-bricolage.component.scss'],
    standalone: false
})
export class AdminBricolageComponent {
  bricoCategories = Object.values(BricoCategories);
  openededCat?: string;
  bois$ = this.bricolageDatabaseService.getBricoCategory('bois');
  maconnerie$ = this.bricolageDatabaseService.getBricoCategory('Maçonnerie&Carrelage');
  percage$ = this.bricolageDatabaseService.getBricoCategory('Perçage&Meulage');
  sciesCloches$ = this.bricolageDatabaseService.getBricoCategory('SciesCloches');
  jardinage$ = this.bricolageDatabaseService.getBricoCategory('Jardinage');
  nettoyage$ = this.bricolageDatabaseService.getBricoCategory('Nettoyage');
  peinture$ = this.bricolageDatabaseService.getBricoCategory('Peinture&Tapisserie&Moquette');
  mecanique$ = this.bricolageDatabaseService.getBricoCategory('Mecanique');
  soudure$ = this.bricolageDatabaseService.getBricoCategory('Soudure&Plomberie');
  electronique$ = this.bricolageDatabaseService.getBricoCategory('Electronique');
  remorques$ = this.bricolageDatabaseService.getBricoCategory('Remorques');
  divers$ = this.bricolageDatabaseService.getBricoCategory('Divers');
  constructor(private bricolageDatabaseService: BricolageDatabaseService,
              private dialog: MatDialog) {
  }

  toolsOfCategory(categoryId: string): Observable<Array<Tool>> {
    switch (categoryId) {
      case 'bois':
        return this.bois$;
      case 'Maçonnerie&Carrelage':
        return this.maconnerie$;
      case 'Perçage&Meulage':
        return this.percage$;
      case 'SciesCloches':
        return this.sciesCloches$;
      case 'Jardinage':
        return this.jardinage$;
      case 'Nettoyage':
        return this.nettoyage$;
      case 'Peinture&Tapisserie&Moquette':
        return this.peinture$
      case 'Mecanique':
        return this.mecanique$;
      case 'Soudure&Plomberie':
        return this.soudure$;
      case 'Electronique':
        return this.electronique$;
      case 'Remorques':
        return this.remorques$;
      case 'Divers':
        return this.divers$;
      default:
        return this.bois$;
    }
  }

  addTool() {
   this.bricolageDatabaseService.allTools$.pipe(take(1)).subscribe(allTools => {
      this.dialog.open(AddToolModalComponent, {
        data: {tools: allTools}
      });
    })
  }

  editTool() {
    this.bricolageDatabaseService.allTools$.pipe(take(1)).subscribe(allTools => {
      this.dialog.open(EditToolModalComponent, {
        data: {tools: allTools}
      });
    })
  }
}
