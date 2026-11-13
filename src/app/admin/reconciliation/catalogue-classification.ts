import {CatalogueRecord} from './column-mapping';

export type Domain = 'bricolage' | 'boardGames' | 'videoGames' | 'outsideGames' | 'photo';
export type ItemType = 'GAME' | 'CONSOLE' | 'ACCESSORY';

/** A catalogue line that belongs to one of the collections of the application, with how it would be filed. */
export interface Proposal {
  record: CatalogueRecord;
  domain: Domain;
  /** The key the item gets in the database when it is added. */
  key: string;
  /** Other keys under which the database may already hold it (barcode, cote with or without spaces). */
  otherKeys: string[];
  /** Title and subtitle joined, in the case the database uses. */
  name: string;
  /** Bricolage or photo category, board game category, console, or `outsideGames`. */
  category: string;
  type?: ItemType;
}

export type Classification =
  | {kind: 'item'; proposal: Proposal}
  | {kind: 'book'}
  | {kind: 'ignored'; reason: string}
  | {kind: 'unclassified'; code: string};

const BRICOLAGE_CATEGORIES: Readonly<Record<string, string>> = {
  MBOIS: 'bois', MACON: 'Maçonnerie&Carrelage', PERC: 'Perçage&Meulage', TAPIS: 'Peinture&Tapisserie&Moquette',
  JARDI: 'Jardinage', NETTO: 'Nettoyage', PLOMB: 'Soudure&Plomberie', ELEC: 'Electronique', AUTO: 'Mecanique', DIVER: 'Divers',
};

const CONSOLES: Readonly<Record<string, string>> = {
  SW: 'switch', PS4: 'ps4', PS5: 'ps5', XB1: 'xboxOne', XBSX: 'xboxX', WII: 'wii', PS3: 'ps3', XB360: 'xbox360',
  DS: 'ds', '3DS': 'ds3', PS2: 'ps2', PSP: 'psp', PSV: 'psVita',
};

// A pack of consoles is filed under a code of its own: the platform is read from its name or cote.
const CONSOLE_PACKS: ReadonlyArray<readonly [string, string]> = [
  ['switch', 'switch'], ['wii', 'wii'], ['dsi', 'ds'], ['vita', 'psVita'], ['ps4', 'ps4'], ['ps5', 'ps5'], ['xbox', 'xboxOne'],
  ['psp', 'psp'], [' ds', 'ds'], ['3ds', 'ds3'], ['2ds', 'ds3'],
];

const BOARD_CATEGORIES: Readonly<Record<string, string>> = {
  LDSCT: 'familial', LDCRT: 'familial', CRTEV: 'familial', SCTJR: 'enfant', SCTAD: 'ambiance', STRTG: 'abstrait', ROLES: 'inclassable', 'AD-CT': 'enfant',
};
const BOARD_NAME_CATEGORIES: ReadonlyArray<readonly [RegExp, string]> = [
  [/unlock/i, 'escape'], [/bombbusters/i, 'coop'], [/perudo|tabou|mensonges|trivia|trivial|questions pour|visionary|brainstorm/i, 'ambiance'],
  [/novembre rouge|myst[eè]res de p[eé]kin/i, 'enquete'], [/reversi|othello|^go$|abalone|awele|quarto|[eé]chec/i, 'abstrait'],
];
const OUTSIDE_CODES: ReadonlySet<string> = new Set(['PLN.R', 'LI-JX']);

// What the software files under a code that does not tell what the item is, and what the user asked not to see.
const IGNORED_BY_NAME = /synth[eé]tiseur|pc junior|guide du boomerang/i;
const IGNORED_CODES: Readonly<Record<string, string>> = {
  MATPC: 'Matériel informatique (écarté à ta demande)',
  'CD-JX': 'Jeu PC sur CD-ROM',
  BDAD: 'BD et mangas', BDJEU: 'BD et mangas jeunesse',
  PER: 'Magazines', 'J PER': 'Magazines', CDMAG: 'Magazines audio', LP: 'Livres audio', 'LI AU': 'Livres audio', ENF: 'CD pour enfants', 'CD-EV': 'CD d’éveil',
};
const MEDIA_COTE = /^(C[A-Z]{2,3}-|CD|DVD)/;
const MEDIA_CODES: ReadonlySet<string> = new Set([
  'V-ET', 'V-FR', 'FOLK', 'JAZZ', 'BLUES', 'CLASS', 'ELECT', 'HUM', 'AMB.', 'CO', 'DR', 'DA', 'CD', 'SF', 'SERIE', 'AE', 'AV', 'DOC', 'FA', 'GU',
  'ES', 'AC', 'AN', 'DE', 'HO', 'HU', 'WE', 'FM', 'CT', 'PO',
]);
const BOOK_CODES: ReadonlySet<string> = new Set([
  'ROM', 'ROM E', 'POL', 'RFY', 'RSF', 'FANT', 'RFK', 'S-F', 'J ROM', 'LI EN', 'J REB', '1ER', 'EVEIL', 'CONTE', 'MANU', 'EDUC', 'POESI', 'REB',
  'D BRE', 'D 100', 'D 200', 'D 300', 'D 400', 'D 500', 'D 600', 'D 700', 'D 800', 'D 900', 'E 200', 'E 300', 'E 500', 'E 600', 'E 700', 'E 900',
]);
const PLACEHOLDER = /code barre dispo|^n° dispo|^xxxx$/i;

const SMALL_WORDS = new Set(['de', 'du', 'la', 'le', 'les', 'des', 'et', 'a', 'au', 'of', 'the', 'and', 'in', 'on', 'dans', 'pour', 'sur']);
// Acronyms and numbers that stay in capitals when an ALL CAPS title is written in readable case.
const KEEP_AS_IS = /^(?:[IVX]+|\d\w*|WII|PS\d?|DS|3DS|NBA|NBA2K\d+|FIFA|PES|WWE|UFC|LEGO|GTA|CSI|MX|ATV|WRC|FC|NHL|NFL|SSX|DSI|PSP|HP|XL|XXL|VR|UNO|PC|TV|DVD|CD|USA|II|III|IV)$/;
const AGE_SUFFIX = /\s*(\+\s*\d{1,2}\s*ANS|A PARTIR DE\s*\d{1,2}\s*ANS|\(\s*>\s*\d{1,2}\s*ans\s*\))/i;

/** A name as the database writes them: no age mention, and an ALL CAPS title in readable case. */
export function readableName(title: string, subtitle: string): string {
  let text = `${title} ${subtitle}`.replace(/\s+/g, ' ').replace(/_/g, '-').trim().replace(AGE_SUFFIX, '').trim();
  if (text === text.toUpperCase() && /[A-Z]{3}/.test(text)) {
    text = text.split(' ').map((word, index) =>
      index > 0 && SMALL_WORDS.has(word.toLowerCase()) ? word.toLowerCase() : KEEP_AS_IS.test(word) ? word : word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  }
  return text;
}

const compact = (text: string): string => text.replace(/\s+/g, '').toLowerCase();

/** The inventory number of a cote such as `PS4-1179`, `SW 1293` or `ps41204`. */
function inventoryNumber(cote: string): string | undefined {
  return /(\d{3,4})\s*$/.exec(cote.trim())?.[1];
}

/**
 * The ways the database may have written the cote of a console, a controller, a camera or a headset: `XBX1-CONSL01`
 * for `XB1-CONSL 02`, `CONSL PS4_02` for `PS4-CONSL 02`.
 */
function accessoryAliases(cote: string): string[] {
  const match = /^(sw|ps4|ps5|xb1|xbx1|xbsx)\W*(consl|man|cam|vr)\W*0*(\d+)/i.exec(cote.trim());
  if (!match) {
    return [];
  }
  const [, platform, kind, number] = match.map(part => part.toLowerCase());
  const platforms = platform === 'xb1' || platform === 'xbx1' ? ['xb1', 'xbx1'] : [platform];
  return platforms.flatMap(name => [`${name}${kind}0${number}`, `${name}${kind}${number}`, `${kind}${name}0${number}`, `${kind}${name}${number}`]);
}

function consoleOf(record: CatalogueRecord): string | undefined {
  const code = record.type.toUpperCase();
  if (CONSOLES[code]) {
    return CONSOLES[code];
  }
  if (code === 'CONSL') {
    const text = ` ${record.title} ${record.cote}`.toLowerCase();
    return CONSOLE_PACKS.find(([word]) => text.includes(word))?.[1];
  }
  return undefined;
}

function videoType(name: string, cote: string): ItemType {
  const text = `${name} ${cote}`.toLowerCase();
  if (/^(pack (wii|ds|psp|3ds)|psp console|console|consl|pack dsi)/.test(name.toLowerCase())) {
    return 'CONSOLE';
  }
  return /manette|joy.?con|chargeur|cam[eé]ra|casque|volant|accessoire|-man\d|-cam\d|-vr\d|ps move|remote plus|^kit |kinect \+ kinect/.test(text) ? 'ACCESSORY' : 'GAME';
}

function photoCategory(cote: string): string {
  const folded = cote.toUpperCase().replace(/\s+/g, '');
  if (folded.startsWith('NUMERIC')) {
    return 'appareilsPhoto';
  }
  if (folded.startsWith('NACC')) {
    return 'accessoires';
  }
  return folded.startsWith('VPROJ') ? 'videoProjecteur' : folded.startsWith('CAM') ? 'camescopes' : 'divers';
}

function item(record: CatalogueRecord, domain: Domain, key: string, category: string, otherKeys: string[], type?: ItemType): Classification {
  const keys = [record.barcode, compact(record.cote), ...otherKeys].filter(Boolean);
  return {
    kind: 'item',
    proposal: {record, domain, key, otherKeys: keys.filter(other => other !== key), name: readableName(record.title, record.subtitle), category, type},
  };
}

/**
 * Where a catalogue line belongs. The cote comes before the type code, which is often wrong (a camera filed as a
 * comic, a board game filed under 3DS); placeholders and what the user asked not to see are set aside with a reason.
 */
export function classify(record: CatalogueRecord): Classification {
  const code = record.type.toUpperCase();
  const cote = record.cote.trim();
  const name = `${record.title} ${record.subtitle}`.trim();
  if (!name || PLACEHOLDER.test(name)) {
    return {kind: 'ignored', reason: 'Ligne vide du logiciel'};
  }
  if (IGNORED_BY_NAME.test(name)) {
    return {kind: 'ignored', reason: 'Écarté à ta demande (synthétiseur, magazines PC Junior, guide du boomerang)'};
  }
  if (/^ludo\s*\d/i.test(cote)) {
    return item(record, 'boardGames', compact(cote), BOARD_CATEGORIES[code] ?? 'familial', []);
  }
  if (/^(NUMERIC|NACC|VPROJ|CAM\b)/i.test(cote)) {
    return item(record, 'photo', cote.replace(/\s+/g, '').toUpperCase(), photoCategory(cote), []);
  }
  if (IGNORED_CODES[code] && !/^(CONSL|SW|PS|XB|WII|DS|3DS)/.test(code)) {
    return {kind: 'ignored', reason: IGNORED_CODES[code]};
  }
  if (MEDIA_CODES.has(code) || MEDIA_COTE.test(cote)) {
    return {kind: 'ignored', reason: 'DVD, CD de musique ou autre support non géré'};
  }
  const console = consoleOf(record);
  if (console) {
    const type = videoType(name, cote);
    const number = inventoryNumber(cote);
    const key = number && type === 'GAME' ? number : compact(cote) || `cat${record.id}`;
    return item(record, 'videoGames', key, console, [`cat${record.id}`, ...accessoryAliases(cote)], type);
  }
  if (code === 'CONSL') {
    return {kind: 'unclassified', code: 'CONSL (plateforme inconnue)'};
  }
  if (BRICOLAGE_CATEGORIES[code]) {
    const key = /^\d+$/.test(record.barcode) ? String(parseInt(record.barcode, 10)) : record.barcode;
    return item(record, 'bricolage', key, BRICOLAGE_CATEGORIES[code], []);
  }
  if (OUTSIDE_CODES.has(code)) {
    return item(record, 'outsideGames', record.barcode || compact(cote), 'outsideGames', []);
  }
  if (code in BOARD_CATEGORIES || code === 'LDMAG' || code === 'GDJX') {
    const readable = readableName(record.title, record.subtitle);
    const category = BOARD_NAME_CATEGORIES.find(([pattern]) => pattern.test(readable))?.[1] ?? BOARD_CATEGORIES[code] ?? 'familial';
    return item(record, 'boardGames', record.barcode || compact(cote), category, []);
  }
  if (BOOK_CODES.has(code)) {
    return {kind: 'book'};
  }
  return {kind: 'unclassified', code: code || '(sans code)'};
}
