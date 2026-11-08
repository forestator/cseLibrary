import {Component} from '@angular/core';
import {AuthentificationService} from '../../../services/firebase/authentification.service';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';

@Component({
    selector: 'app-bibliotheque',
    templateUrl: './bibliotheque.component.html',
    styleUrls: ['./bibliotheque.component.scss'],
    standalone: false
})
export class BibliothequeComponent {

  constructor(
    public authService: AuthentificationService,
    public firebaseDatabaseService: FirebaseDatabaseService) {
  }
}

