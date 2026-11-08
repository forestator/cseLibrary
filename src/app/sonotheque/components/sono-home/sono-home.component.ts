import {Component, ChangeDetectionStrategy} from '@angular/core';
import {AuthentificationService} from "../../../services/firebase/authentification.service";
import {ToolsService} from "../../../services/biblio/tools.service";
import {SonoDatabaseService} from "../../services/sono-database.service";

@Component({
    selector: 'app-sono-home',
    templateUrl: './sono-home.component.html',
    styleUrls: ['./sono-home.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SonoHomeComponent {
  constructor(public sonoDb: SonoDatabaseService,
              public authService: AuthentificationService,
              public toolsService: ToolsService) {
  }
}
