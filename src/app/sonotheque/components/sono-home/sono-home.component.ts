import {Component, ChangeDetectionStrategy} from '@angular/core';
import {AuthentificationService} from "../../../services/firebase/authentification.service";
import {ToolsService} from "../../../services/biblio/tools.service";
import {SonoDatabaseService} from "../../services/sono-database.service";
import { RouterLinkActive, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-sono-home',
    templateUrl: './sono-home.component.html',
    styleUrls: ['./sono-home.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLinkActive, RouterLink, AsyncPipe]
})
export class SonoHomeComponent {
  constructor(public sonoDb: SonoDatabaseService,
              public authService: AuthentificationService,
              public toolsService: ToolsService) {
  }
}
