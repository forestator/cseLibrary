import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {BookStatus} from '../../../models/author.model';
import {BoardGameCategory} from '../../../models/boardGame.model';
import {Consoles} from '../../../models/videoGames.model';

type BadgeTone =
  'green' | 'lime' | 'orange' | 'red' | 'pink' | 'purple' | 'violet' | 'blue' | 'teal' | 'amber' | 'ink' | 'gray';

interface BadgeView {
  label: string;
  tone: BadgeTone;
}

const BOOK_STATUS_VIEWS: Partial<Record<string, BadgeView>> = {
  [BookStatus.NEW]: {label: 'NOUVEAU', tone: 'lime'},
  [BookStatus.AVAILABLE]: {label: 'DISPONIBLE', tone: 'green'},
  [BookStatus.DECLASSED]: {label: 'DECLASSE', tone: 'orange'},
  [BookStatus.MISSING]: {label: 'PERDU!', tone: 'red'},
  [BookStatus.IN_PROJECT]: {label: 'EN PROJET', tone: 'pink'},
};

// Statuses used by the catalogue commissions, which have no dedicated enum.
const CATALOGUE_STATUS_VIEWS: Partial<Record<string, BadgeView>> = {
  HS: {label: 'HS', tone: 'red'},
  REPARATION: {label: 'EN RÉPARATION', tone: 'orange'},
};

const BOARD_GAME_TONES: Record<BoardGameCategory, BadgeTone> = {
  [BoardGameCategory.duo]: 'amber',
  [BoardGameCategory.ambiance]: 'pink',
  [BoardGameCategory.culture]: 'purple',
  [BoardGameCategory.familial]: 'green',
  [BoardGameCategory.strategie]: 'red',
  [BoardGameCategory.puzzle]: 'violet',
  [BoardGameCategory.enfant]: 'blue',
  [BoardGameCategory.escape]: 'teal',
  [BoardGameCategory.abstrait]: 'orange',
  [BoardGameCategory.inclassable]: 'gray',
  [BoardGameCategory.enquete]: 'ink',
  [BoardGameCategory.coop]: 'orange',
};

const CONSOLE_VIEWS: Record<Consoles, BadgeView> = {
  [Consoles.switch]: {label: Consoles.switch, tone: 'red'},
  [Consoles.switch2]: {label: Consoles.switch2, tone: 'pink'},
  [Consoles.ps4]: {label: Consoles.ps4.toUpperCase(), tone: 'blue'},
  [Consoles.ps5]: {label: Consoles.ps5.toUpperCase(), tone: 'blue'},
  [Consoles.xboxOne]: {label: Consoles.xboxOne, tone: 'green'},
  [Consoles.xboxX]: {label: Consoles.xboxX, tone: 'teal'},
};

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  readonly status = input<string>();
  readonly display = input<'normal' | 'small'>('normal');

  protected readonly view = computed<BadgeView | undefined>(() => {
    const status = this.status();
    if (!status) {
      return undefined;
    }
    const known = BOOK_STATUS_VIEWS[status] ?? CATALOGUE_STATUS_VIEWS[status] ?? CONSOLE_VIEWS[status as Consoles];
    if (known) {
      return known;
    }
    if (status in BOARD_GAME_TONES) {
      return {label: capitalize(status), tone: BOARD_GAME_TONES[status as BoardGameCategory]};
    }
    return {label: status, tone: 'gray'};
  });
}
