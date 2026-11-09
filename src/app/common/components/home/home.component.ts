import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {NavigationService} from '../../../services/navigation.service';
import {AuthentificationService} from "../../../services/firebase/authentification.service";
import {Comissions} from "../../../models/common.model";
import {GamesUtils} from '../../../models/gamesUtils';
import moment from 'moment';
import {BiblioUtils} from '../../../bibliotheque/models/biblio-utils';
import {nextBricolageOpening} from '../../../catalogue/models/commission-schedule';
import { MomentToDatePipe } from '../../pipe/moment-to-date.pipe';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MomentToDatePipe]
})
export class HomeComponent {
  navigateService = inject(NavigationService);
  authentificationService = inject(AuthentificationService);


  comissions = Comissions;

  gotoUrl(url: string) {
    window.open(url, "_blank");
  }

  protected readonly GamesUtils = GamesUtils;
  protected readonly moment = moment;
    protected readonly BiblioUtils = BiblioUtils;
  protected readonly nextBricolageOpening = nextBricolageOpening;
}
