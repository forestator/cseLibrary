import {Component} from '@angular/core';
import {NavigationService} from '../../../services/navigation.service';
import {AuthentificationService} from "../../../services/firebase/authentification.service";
import {Comissions} from "../../../models/common.model";
import {GamesUtils} from '../../../models/gamesUtils';
import moment from 'moment';
import {BiblioUtils} from '../../../bibliotheque/models/biblio-utils';
import {BricoUtils} from '../../../bricolage/models/brico-utils';
import {SonoUtils} from '../../../sonotheque/models/sono.utils';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent {

  comissions = Comissions;

  constructor(public navigateService: NavigationService, public authentificationService: AuthentificationService) { }

  gotoUrl(url: string) {
    window.open(url, "_blank");
  }

  protected readonly GamesUtils = GamesUtils;
  protected readonly moment = moment;
    protected readonly BiblioUtils = BiblioUtils;
  protected readonly BricoUtils = BricoUtils;
  protected readonly SonoUtils = SonoUtils;
}
