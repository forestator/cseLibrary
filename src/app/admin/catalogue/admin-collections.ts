import {inject, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {firstValueFrom, map, Observable, of} from 'rxjs';
import {BRICOLAGE_CONFIG, NAUTISME_CONFIG, PHOTO_CONFIG, SONOTHEQUE_CONFIG} from '../../catalogue/models/commission-configs';
import {CatalogueItem} from '../../catalogue/models/catalogue-item.model';
import {CommissionConfig} from '../../catalogue/models/commission-config.model';
import {CatalogueRepositories} from '../../catalogue/services/catalogue-repositories.service';
import {GamesRepository} from '../../ludotheque/services/games.repository';
import {Comissions, Game, LibraryId} from '../../models/common.model';
import {BoardGame} from '../../models/boardGame.model';
import {AuthentificationService} from '../../services/firebase/authentification.service';
import {ADMIN_DIALOG_CONFIG} from '../admin-dialog.config';
import {AddGameModalComponent} from '../components/admin-ludo/admin-games/add-game-modal/add-game-modal.component';
import {CatalogueItemDialog} from '../components/catalogue-admin/catalogue-item-dialog/catalogue-item-dialog';
import {COMMISSION_NAV} from '../../navigation/navigation.config';
import {AdminCollection, AdminItem, AdminSection} from './admin-collection.model';

type GameWithStatus = Game & {status?: string};

interface CatalogueCollectionInfo {
  config: CommissionConfig;
  label: string;
  icon: string;
}

const CATALOGUE_COLLECTIONS: ReadonlyArray<CatalogueCollectionInfo> = [
  {config: BRICOLAGE_CONFIG, label: 'Bricolage', icon: 'handyman'},
  {config: SONOTHEQUE_CONFIG, label: 'Sonothèque', icon: 'speaker'},
  {config: NAUTISME_CONFIG, label: 'Nautisme', icon: 'kayaking'},
  {config: PHOTO_CONFIG, label: 'Photo & vidéo', icon: 'photo_camera'},
];

const GAME_COLLECTIONS: ReadonlyArray<{libraryId: LibraryId; label: string; icon: string}> = [
  {libraryId: 'boardGames', label: 'Jeux de société', icon: 'casino'},
  {libraryId: 'videoGames', label: 'Jeux vidéo', icon: 'sports_esports'},
  {libraryId: 'outsideGames', label: 'Grands jeux', icon: 'sports_handball'},
];

const SECTION_SUMMARIES: Readonly<Record<string, string>> = {
  [Comissions.BIBLIOTHEQUE]: 'Catégories, auteurs, séries et livres des quatre bibliothèques.',
  [Comissions.LUDOTHEQUE]: 'Jeux de société, jeux vidéo et grands jeux.',
  [Comissions.BRICOLAGE]: 'Outils et machines à prêter.',
  [Comissions.SONOTHEQUE]: 'Matériel de sonorisation et de lumière.',
  [Comissions.NAUTISME]: 'Matériel nautique.',
  [Comissions.PHOTO]: 'Appareils photo, caméscopes, projecteurs et accessoires.',
};

/**
 * Every collection of objects managed from the global administration. Each one sits on the repository
 * of its commission, which stays the only code talking to Firestore, and opens the existing forms.
 */
@Injectable({providedIn: 'root'})
export class AdminCollections {
  private readonly dialog = inject(MatDialog);
  private readonly auth = inject(AuthentificationService);
  private readonly catalogues = inject(CatalogueRepositories);
  private readonly games = inject(GamesRepository);

  private readonly collections: ReadonlyArray<AdminCollection> = [
    ...GAME_COLLECTIONS.map(info => this.gameCollection(info.libraryId, info.label, info.icon)),
    ...CATALOGUE_COLLECTIONS.map(info => this.catalogueCollection(info)),
  ];

  /** One section per commission, in the order of the side rail. */
  readonly sections: ReadonlyArray<AdminSection> = COMMISSION_NAV.map(commission => ({
    id: commission.id,
    label: commission.label,
    icon: commission.icon,
    summary: SECTION_SUMMARIES[commission.id] ?? '',
    canManage$: this.canManage(commission.id),
    collections: this.collections.filter(collection => collection.commission === commission.id),
  }));

  private canManage(commission: string): Observable<boolean> {
    if (commission === Comissions.LUDOTHEQUE) {
      return this.auth.isUserLudoAdmin$;
    }
    if (commission === Comissions.BIBLIOTHEQUE) {
      return this.auth.isUserSuperAdmin;
    }
    const info = CATALOGUE_COLLECTIONS.find(candidate => candidate.config.id === commission);
    return info ? this.auth[info.config.adminLink.guard] : of(false);
  }

  private catalogueCollection({config, label, icon}: CatalogueCollectionInfo): AdminCollection {
    const repository = this.catalogues.of(config);
    const stored$ = repository.allItems$.pipe(map(collection => Object.values(collection)));
    return {
      id: config.id,
      commission: config.id,
      label,
      icon,
      canManage$: this.auth[config.adminLink.guard],
      items$: stored$.pipe(map(items => items.map(item => ({
        key: `${config.id}/${item.categoryId ?? ''}/${item.id}`,
        collectionId: config.id,
        categoryId: item.categoryId,
        name: item.name,
        ref: config.showRef ? item.id : undefined,
        status: item.status ?? config.defaultStatus,
        cover: item.cover,
        source: item,
      })))),
      add: async () => {
        const items = await firstValueFrom(stored$);
        this.dialog.open(CatalogueItemDialog, {data: {config, items}, ...ADMIN_DIALOG_CONFIG});
      },
      edit: async (item: AdminItem) => {
        const items = await firstValueFrom(stored$);
        this.dialog.open(CatalogueItemDialog, {data: {config, items, selectedItem: item.source as CatalogueItem}, ...ADMIN_DIALOG_CONFIG});
      },
    };
  }

  private gameCollection(libraryId: LibraryId, label: string, icon: string): AdminCollection {
    return {
      id: libraryId,
      commission: Comissions.LUDOTHEQUE,
      label,
      icon,
      canManage$: this.auth.isUserLudoAdmin$,
      items$: this.games.watchGames$(libraryId).pipe(map(games => games.map(game => ({
        key: `${libraryId}/${game.ref}`,
        collectionId: libraryId,
        categoryId: game.category,
        name: game.name,
        ref: game.ref,
        status: (game as GameWithStatus).status,
        cover: game.cover,
        source: game,
      })))),
      add: async () => {
        const games = await firstValueFrom(this.games.loadAllGames$());
        this.dialog.open(AddGameModalComponent, {data: {games}, ...ADMIN_DIALOG_CONFIG});
      },
      edit: async (item: AdminItem) => {
        const games = await firstValueFrom(this.games.loadAllGames$());
        this.dialog.open(AddGameModalComponent, {data: {games, selectedGame: item.source as BoardGame}, ...ADMIN_DIALOG_CONFIG});
      },
    };
  }
}
