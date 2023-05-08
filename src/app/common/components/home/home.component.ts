import {Component} from '@angular/core';
import {NavigationService} from '../../../services/navigation.service';
import {AuthentificationService} from "../../../services/firebase/authentification.service";
import {Comissions} from "../../../models/common.model";
import {GamesUtils} from '../../../models/gamesUtils';
import moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  comissions = Comissions;

  constructor(public navigateService: NavigationService, public authentificationService: AuthentificationService) { }

  gotoUrl(url: string) {
    window.open(url, "_blank");
  }

  protected readonly GamesUtils = GamesUtils;
  protected readonly moment = moment;
}
