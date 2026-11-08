import {Component, ChangeDetectionStrategy} from '@angular/core';
import {AuthentificationService} from "../../../services/firebase/authentification.service";
import {ToolsService} from "../../../services/biblio/tools.service";
import {MaterielPhotoDatabaseService} from "../../services/materiel-photo-database.service";

@Component({
    selector: 'app-materiel-photo-home',
    templateUrl: './materiel-photo-home.component.html',
    styleUrls: ['./materiel-photo-home.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MaterielPhotoHomeComponent {

  constructor(public materielPhotoDatabaseService: MaterielPhotoDatabaseService,
              public authService: AuthentificationService,
              public toolsService: ToolsService) {
  }
}
