import {Component, ChangeDetectionStrategy} from '@angular/core';
import {AuthentificationService} from '../../../services/firebase/authentification.service';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-bibliotheque',
    templateUrl: './bibliotheque.component.html',
    styleUrls: ['./bibliotheque.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink, AsyncPipe]
})
export class BibliothequeComponent {

  constructor(
    public authService: AuthentificationService,
    public firebaseDatabaseService: FirebaseDatabaseService) {
  }
}

