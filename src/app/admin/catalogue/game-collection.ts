import {firstValueFrom, map} from 'rxjs';
import {BggGameSearchModalComponent} from '../components/admin-ludo/admin-games/bgg-game-search-modal/bgg-game-search-modal.component';
import {BGGService} from '../../ludotheque/services/bgg.service';
import {GamesRepository} from '../../ludotheque/services/games.repository';
import {categoryLabel} from '../../ludotheque/pipes/game-category-label.pipe';
import {BoardGame, BoardGameCategory, Thing} from '../../models/boardGame.model';
import {Game, LibraryId} from '../../models/common.model';
import {Consoles} from '../../models/videoGames.model';
import {OpenAiService} from '../../services/open-ai.service';
import {StorageUploadService} from '../../services/firebase/storage-upload.service';
import {MatDialog} from '@angular/material/dialog';
import {AdminField, AdminFormSection, AdminFormValues} from '../form/admin-form.model';
import {toStoredEntry} from '../form/admin-form';
import {AdminAssist, AdminCollection, AdminItem} from './admin-collection.model';
import {ITEM_STATUSES} from './admin-statuses';
import {Comissions} from '../../models/common.model';

export interface GameCollectionDeps {
  libraryId: LibraryId;
  label: string;
  icon: string;
  games: GamesRepository;
  upload: StorageUploadService;
  bgg: BGGService;
  openAi: OpenAiService;
  dialog: MatDialog;
  canManage$: AdminCollection['canManage$'];
}

const OUTSIDE_CATEGORY = 'outsideGames';

function categoryOptions(libraryId: LibraryId): AdminField['options'] {
  const values: ReadonlyArray<string> = libraryId === 'videoGames' ? Object.values(Consoles)
    : libraryId === 'outsideGames' ? [OUTSIDE_CATEGORY] : Object.values(BoardGameCategory);
  return values.map(value => ({value, label: value === OUTSIDE_CATEGORY ? 'Grand jeu' : categoryLabel(value)}));
}

const BOARD_GAME_DETAILS: ReadonlyArray<AdminField> = [
  {key: 'id', label: 'Identifiant BoardGameGeek', kind: 'text'},
  {key: 'weight', label: 'Poids (g)', kind: 'number'},
  {key: 'minPlayers', label: 'Minimum de joueurs', kind: 'number'},
  {key: 'maxPlayers', label: 'Maximum de joueurs', kind: 'number'},
  {key: 'minAge', label: 'Âge minimum', kind: 'number'},
  {key: 'suggestedPlayAge', label: 'Âge suggéré', kind: 'number'},
  {key: 'playingTime', label: 'Durée de jeu (minutes)', kind: 'number'},
  {key: 'yearPublished', label: 'Année de publication', kind: 'number'},
];

function gameSections(libraryId: LibraryId): ReadonlyArray<AdminFormSection> {
  const sections: AdminFormSection[] = [{
    id: 'info', title: 'Informations',
    fields: [
      {key: 'name', label: 'Nom', kind: 'text', required: true},
      {key: 'ref', label: 'Référence', kind: 'text', required: true, placeholder: libraryId === 'boardGames' ? 'ludo1234' : undefined},
      {key: 'category', label: libraryId === 'videoGames' ? 'Console' : 'Catégorie', kind: 'select', required: true, options: categoryOptions(libraryId)},
      {key: 'description', label: 'Description', kind: 'textarea'},
      {key: 'status', label: 'Statut', kind: 'status', required: true, options: ITEM_STATUSES},
      {key: 'isNew', label: 'Nouveauté', kind: 'checkbox'},
    ],
  }];
  if (libraryId === 'boardGames') {
    sections.push({id: 'details', title: 'Détails du jeu', fields: BOARD_GAME_DETAILS});
  }
  if (libraryId === 'videoGames') {
    sections.push({
      id: 'type', title: 'Type de produit',
      fields: [{key: 'type', label: 'Type', kind: 'select', required: true, options: [
        {value: 'GAME', label: 'Jeu'}, {value: 'CONSOLE', label: 'Console'}, {value: 'ACCESSORY', label: 'Accessoire'},
      ]}],
    });
  }
  return sections;
}

function numberOf(value: string | undefined): number | undefined {
  const parsed = Number(value);
  return value !== undefined && value !== '' && Number.isFinite(parsed) ? parsed : undefined;
}

/** BoardGameGeek search and auto-fill, offered to board games only. */
function boardGameAssist(deps: GameCollectionDeps): AdminAssist {
  return {
    searchLabel: 'Rechercher sur BoardGameGeek',
    fillLabel: 'Remplir automatiquement les champs',
    pick: async name => {
      const found = await firstValueFrom(deps.bgg.searchGame(name));
      const thing: Thing | undefined = await firstValueFrom(
        deps.dialog.open(BggGameSearchModalComponent, {data: {games: found}}).afterClosed());
      return thing?.attributes?.id;
    },
    fill: async values => {
      const known = {id: String(values['id']), name: String(values['name']), description: values['description'] || undefined} as BoardGame;
      const detailed = await firstValueFrom(deps.bgg.gameDetails(known));
      const description = await deps.openAi.genDescriptionJeu(detailed).catch(error => {
        console.warn(error);
        return undefined;
      });
      const found: AdminFormValues = {};
      const put = (key: string, value: string | number | undefined): void => {
        if (value !== undefined && value !== '' && !Number.isNaN(value)) {
          found[key] = value;
        }
      };
      for (const key of ['yearPublished', 'minPlayers', 'maxPlayers', 'playingTime', 'minAge', 'suggestedPlayAge'] as const) {
        put(key, numberOf(String(detailed[key])));
      }
      put('description', description ?? detailed.description);
      return {values: found, extra: detailed.themes ? {themes: detailed.themes} : {}};
    },
  };
}

/** One library of the ludotheque as an administration collection. */
export function createGameCollection(deps: GameCollectionDeps): AdminCollection {
  const {libraryId, games} = deps;
  const sections = gameSections(libraryId);
  const fields = sections.flatMap(section => section.fields);

  return {
    id: libraryId,
    commission: Comissions.LUDOTHEQUE,
    label: deps.label,
    icon: deps.icon,
    canManage$: deps.canManage$,
    items$: games.watchGames$(libraryId).pipe(map(list => list.map(game => ({
      key: `${libraryId}/${game.ref}`,
      id: game.ref,
      collectionId: libraryId,
      categoryId: game.category,
      name: game.name,
      ref: game.ref,
      status: (game as Game & {status?: string}).status,
      cover: game.cover,
      source: game,
    })))),
    form: {
      noun: libraryId === 'boardGames' ? 'un jeu de société' : libraryId === 'videoGames' ? 'un jeu vidéo' : 'un grand jeu',
      keyField: 'ref',
      sections,
      defaults: {
        isNew: true,
        status: 'AVAILABLE',
        ...(libraryId === 'outsideGames' ? {category: OUTSIDE_CATEGORY} : {}),
        ...(libraryId === 'videoGames' ? {type: 'GAME'} : {}),
      },
    },
    assist: libraryId === 'boardGames' ? boardGameAssist(deps) : undefined,
    // A reference is unique across the three libraries.
    existingKeys: async () => (await firstValueFrom(games.loadAllGames$())).map(game => game.ref),
    uploadCover: (file, values) => deps.upload.uploadCover(file, `/assets/games/covers/${libraryId}`, String(values['name'])),
    save: async ({values, cover, extra, original}) => {
      const previous = original?.source as Game | undefined;
      const entry = {
        ...toStoredEntry(previous && {...previous}, values, fields),
        ...extra,
        libraryId,
        ...(cover ? {cover} : {}),
      } as unknown as Game;
      await games.saveGame(entry, libraryId, previous);
    },
    remove: (item: AdminItem) => games.deleteGame(item.source as Game),
  };
}
