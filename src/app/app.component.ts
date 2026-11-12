import {DOCUMENT} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, effect, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {filter, map} from 'rxjs';
import {LibrarySearchComponent} from './bibliotheque/components/library-search/library-search.component';
import {CatalogueMenu} from './catalogue/components/catalogue-menu/catalogue-menu';
import {CatalogueCommission} from './catalogue/models/commission-config.model';
import {FilterBoardGamesComponent} from './ludotheque/components/board-games/components/filter-board-games/filter-board-games.component';
import {LudoMenuComponent} from './ludotheque/components/ludo-menu/ludo-menu.component';
import {Comissions} from './models/common.model';
import {COMMISSION_NAV, sectionOf, subMenuOf} from './navigation/navigation.config';
import {ToolsService} from './services/biblio/tools.service';
import {ThemeService} from './services/theme.service';
import {AuthentificationService} from './services/firebase/authentification.service';

const MOBILE_QUERY = '(max-width: 839px)';
const THEME_LABELS = {system: 'Thème automatique', light: 'Thème clair', dark: 'Thème sombre'} as const;
const THEME_ICONS = {system: 'brightness_auto', light: 'light_mode', dark: 'dark_mode'} as const;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CatalogueMenu, FilterBoardGamesComponent, LibrarySearchComponent, LudoMenuComponent, MatIcon, MatIconButton, RouterLink, RouterLinkActive, RouterOutlet],
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly toolsService = inject(ToolsService);
  private readonly theme = inject(ThemeService);
  private readonly document = inject(DOCUMENT);

  /** Signed-in administrators get a link to the global administration. */
  protected readonly isAdmin = toSignal(inject(AuthentificationService).isUserAnyAdmin$, {initialValue: false});

  protected readonly commissions = COMMISSION_NAV;
  protected readonly navOpen = signal(false);
  protected readonly isMobile = signal(this.matchesMobile());

  private readonly url = toSignal(
    this.router.events.pipe(filter(event => event instanceof NavigationEnd), map(event => event.urlAfterRedirects)),
    {initialValue: this.router.url}
  );

  protected readonly section = computed(() => sectionOf(this.url()));
  protected readonly sectionLabel = computed(() => COMMISSION_NAV.find(commission => commission.id === this.section())?.label ?? 'CSE');
  protected readonly subMenu = computed(() => subMenuOf(this.section()));
  protected readonly isAdminPage = computed(() => this.url().includes('/admin'));
  protected readonly showBoardGameFilters = computed(() => this.url().includes('boardGames/'));
  protected readonly searchKind = computed(() => {
    if (this.isAdminPage()) {
      return 'none';
    }
    switch (this.section()) {
      case Comissions.LUDOTHEQUE:
        return 'ludotheque';
      case Comissions.BIBLIOTHEQUE:
        return 'bibliotheque';
      case Comissions.BRICOLAGE:
      case Comissions.SONOTHEQUE:
      case Comissions.NAUTISME:
      case Comissions.PHOTO:
        return 'catalogue';
      default:
        return 'none';
    }
  });
  protected readonly catalogueCommission = computed(() => this.section() as CatalogueCommission);
  protected readonly navHidden = computed(() => this.isMobile() && !this.navOpen());

  protected readonly themeLabel = computed(() => THEME_LABELS[this.theme.preference()]);
  protected readonly themeIcon = computed(() => THEME_ICONS[this.theme.preference()]);

  constructor() {
    const query = window.matchMedia(MOBILE_QUERY);
    query.addEventListener('change', event => this.isMobile.set(event.matches));
    // Rows still read the legacy flag to adapt their layout.
    effect(() => this.toolsService.mobilePhoneDisplay$.next(this.isMobile()));
// Dialogs and panels live in the CDK overlay, outside the shell: the accent has to be reachable from the root.
effect(() => {
  const root = this.document.documentElement;
  const section = this.section();
  if (section) {
    root.dataset['commission'] = section;
  } else {
    delete root.dataset['commission'];
  }
});
    effect(() => {
      this.url();
      this.navOpen.set(false);
    });
  }

  protected toggleNav(): void {
    this.navOpen.update(open => !open);
  }

  protected closeNav(): void {
    this.navOpen.set(false);
  }

  protected cycleTheme(): void {
    this.theme.cycle();
  }

  protected scrollToTop(): void {
    window.scrollTo({top: 0});
  }

  private matchesMobile(): boolean {
    return window.matchMedia(MOBILE_QUERY).matches;
  }
}
