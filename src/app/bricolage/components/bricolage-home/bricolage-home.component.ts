import {Component} from '@angular/core';
import {BricolageDatabaseService} from '../../services/bricolage-database.service';
import {ToolsService} from '../../../services/biblio/tools.service';
import {Observable} from 'rxjs';
import {Library} from '../../../models/author.model';

@Component({
  selector: 'app-bricolage-home',
  templateUrl: './bricolage-home.component.html',
  styleUrls: ['./bricolage-home.component.scss']
})
export class BricolageHomeComponent {
  bricoLibrary$: Observable<Library> = this.bricoDb.bricolageLibrary$;

  constructor(private bricoDb: BricolageDatabaseService, public toolsService: ToolsService) {
  }
}
