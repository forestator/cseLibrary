import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {AuthentificationService} from "../../../services/firebase/authentification.service";
import {ToolsService} from "../../../services/biblio/tools.service";
import {NautismeDatabaseService} from "../../services/nautisme-database.service";
import { NautismeItemRowComponent } from '../nautisme-item-row/nautisme-item-row.component';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-nautisme-home',
    templateUrl: './nautisme-home.component.html',
    styleUrls: ['./nautisme-home.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NautismeItemRowComponent, RouterLink, AsyncPipe]
})
export class NautismeHomeComponent {
  nautismeDatabaseService = inject(NautismeDatabaseService);
  authService = inject(AuthentificationService);
  toolsService = inject(ToolsService);
}
