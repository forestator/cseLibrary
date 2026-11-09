import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {Moment} from 'moment';
import {BiblioUtils} from '../../../bibliotheque/models/biblio-utils';
import {nextBricolageOpening} from '../../../catalogue/models/commission-schedule';
import {Comissions} from '../../../models/common.model';
import {GamesUtils} from '../../../models/gamesUtils';
import {COMMISSION_NAV} from '../../../navigation/navigation.config';
import {MomentToDatePipe} from '../../pipe/moment-to-date.pipe';

interface HomeCard {
  id: Comissions;
  label: string;
  icon: string;
  route: string;
  summary: string;
  cover: string;
  nextSession?: Moment;
}

const BDGEST_URL = 'https://www.bdgest.com/online/collection?IdUser=118221&IdCollection=1';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MomentToDatePipe, NgOptimizedImage, RouterLink],
})
export class HomeComponent {
  protected readonly bdgestUrl = BDGEST_URL;

  // Only some commissions hold regular sessions; the others lend on request.
  protected readonly cards: ReadonlyArray<HomeCard> = COMMISSION_NAV.map(commission => ({
    ...commission,
    nextSession: this.nextSessionOf(commission.id),
  }));

  private nextSessionOf(commission: Comissions): Moment | undefined {
    switch (commission) {
      case Comissions.BIBLIOTHEQUE:
        return BiblioUtils.nextComission();
      case Comissions.LUDOTHEQUE:
        return GamesUtils.getNextLudothequeOpening();
      case Comissions.BRICOLAGE:
        return nextBricolageOpening();
      default:
        return undefined;
    }
  }
}
