import {Component} from '@angular/core';
import {BricolageDatabaseService} from '../../services/bricolage-database.service';
import {ToolsService} from '../../../services/biblio/tools.service';
import {AuthentificationService} from '../../../services/firebase/authentification.service';

@Component({
  selector: 'app-bricolage-home',
  templateUrl: './bricolage-home.component.html',
  styleUrls: ['./bricolage-home.component.scss']
})
export class BricolageHomeComponent {
  constructor(public bricoDb: BricolageDatabaseService,
              public authService: AuthentificationService,
              public toolsService: ToolsService) {
  }
}
