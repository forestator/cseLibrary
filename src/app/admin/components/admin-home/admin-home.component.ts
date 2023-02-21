import {Component} from '@angular/core';
import {AuthentificationService} from '../../../services/authentification.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent {

  constructor(public auth: AuthentificationService) {
  }
}
