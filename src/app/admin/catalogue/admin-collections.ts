import {inject, Injectable, Injector} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';
import {BRICOLAGE_CONFIG, NAUTISME_CONFIG, PHOTO_CONFIG, SONOTHEQUE_CONFIG} from '../../catalogue/models/commission-configs';
import {CommissionConfig} from '../../catalogue/models/commission-config.model';
import {CatalogueRepositories} from '../../catalogue/services/catalogue-repositories.service';
import {BGGService} from '../../ludotheque/services/bgg.service';
import {GamesRepository} from '../../ludotheque/services/games.repository';
import {Comissions, LibraryId} from '../../models/common.model';
import {COMMISSION_NAV} from '../../navigation/navigation.config';
import {CloudinaryService} from '../../services/cloudinary.service';
import {AuthentificationService} from '../../services/firebase/authentification.service';
import {StorageUploadService} from '../../services/firebase/storage-upload.service';
import {OpenAiService} from '../../services/open-ai.service';
import {AdminCollection, AdminSection} from './admin-collection.model';
import {createCatalogueCollection} from './catalogue-collection';
import {createGameCollection} from './game-collection';
import {createLibraryCollection} from './library-collection';

interface CatalogueCollectionInfo {
  config: CommissionConfig;
  label: string;
  icon: string;
  noun: string;
}

const CATALOGUE_COLLECTIONS: ReadonlyArray<CatalogueCollectionInfo> = [
  {config: BRICOLAGE_CONFIG, label: 'Bricolage', icon: 'handyman', noun: 'un outil'},
  {config: SONOTHEQUE_CONFIG, label: 'Sonothèque', icon: 'speaker', noun: 'un équipement'},
  {config: NAUTISME_CONFIG, label: 'Nautisme', icon: 'kayaking', noun: 'un équipement'},
  {config: PHOTO_CONFIG, label: 'Photo & vidéo', icon: 'photo_camera', noun: 'un équipement'},
];

const GAME_COLLECTIONS: ReadonlyArray<{libraryId: LibraryId; label: string; icon: string}> = [
  {libraryId: 'boardGames', label: 'Jeux de société', icon: 'casino'},
  {libraryId: 'videoGames', label: 'Jeux vidéo', icon: 'sports_esports'},
  {libraryId: 'outsideGames', label: 'Grands jeux', icon: 'sports_handball'},
];

const LIBRARY_COLLECTIONS: ReadonlyArray<{libraryId: string; label: string; icon: string}> = [
  {libraryId: 'litterature-imaginaire', label: 'Imaginaire', icon: 'auto_stories'},
  {libraryId: 'inclassable', label: 'Inclassable', icon: 'category'},
  {libraryId: 'litterature-jeunesse', label: 'Jeunesse', icon: 'child_care'},
  {libraryId: 'litterature-adulte', label: 'Adultes', icon: 'menu_book'},
];

const SECTION_SUMMARIES: Readonly<Record<string, string>> = {
  [Comissions.BIBLIOTHEQUE]: 'Les livres des quatre bibliothèques, et leur structure (catégories, auteurs, séries).',
  [Comissions.LUDOTHEQUE]: 'Jeux de société, jeux vidéo et grands jeux.',
  [Comissions.BRICOLAGE]: 'Outils et machines à prêter.',
  [Comissions.SONOTHEQUE]: 'Matériel de sonorisation et de lumière.',
  [Comissions.NAUTISME]: 'Matériel nautique.',
  [Comissions.PHOTO]: 'Appareils photo, caméscopes, projecteurs et accessoires.',
};

/**
 * Every collection of objects managed from the global administration. Each one sits on the repository
 * of its commission, which stays the only code talking to Firestore.
 */
@Injectable({providedIn: 'root'})
export class AdminCollections {
  private readonly auth = inject(AuthentificationService);
  private readonly catalogues = inject(CatalogueRepositories);
  private readonly games = inject(GamesRepository);
  private readonly upload = inject(StorageUploadService);
  private readonly bgg = inject(BGGService);
  private readonly openAi = inject(OpenAiService);
  private readonly dialog = inject(MatDialog);
  private readonly injector = inject(Injector);
  private readonly cloudinary = inject(CloudinaryService);

  private readonly collections: ReadonlyArray<AdminCollection> = [
    ...GAME_COLLECTIONS.map(info => createGameCollection({
      ...info, games: this.games, upload: this.upload, bgg: this.bgg, openAi: this.openAi, dialog: this.dialog,
      canManage$: this.auth.isUserLudoAdmin$,
    })),
    ...LIBRARY_COLLECTIONS.map(info => createLibraryCollection({
      ...info, injector: this.injector, upload: this.upload, cloudinary: this.cloudinary, canManage$: this.auth.isUserSuperAdmin,
    })),
    ...CATALOGUE_COLLECTIONS.map(info => createCatalogueCollection({
      ...info, repository: this.catalogues.of(info.config), upload: this.upload, canManage$: this.auth[info.config.adminLink.guard],
    })),
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
}
