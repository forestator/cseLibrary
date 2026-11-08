import {Component} from '@angular/core';
import {AuthentificationService} from "../../../services/firebase/authentification.service";
import {ToolsService} from "../../../services/biblio/tools.service";
import {NautismeDatabaseService} from "../../services/nautisme-database.service";

@Component({
    selector: 'app-nautisme-home',
    templateUrl: './nautisme-home.component.html',
    styleUrls: ['./nautisme-home.component.scss'],
    standalone: false
})
export class NautismeHomeComponent {

  constructor(public nautismeDatabaseService: NautismeDatabaseService,
              public authService: AuthentificationService,
              public toolsService: ToolsService) {
  }
}
