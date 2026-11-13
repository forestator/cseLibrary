import {Classification, Domain, Proposal, classify} from './catalogue-classification';
import {CatalogueRecord} from './column-mapping';

/** What the database holds, in the shape the comparison needs. */
export interface DbItem {
  domain: Domain;
  /** The key of the item in its collection. */
  key: string;
  name: string;
  /** Bricolage or photo category, console, board game category. */
  category?: string;
  collectionId: string;
}

/** What the user asked never to be proposed again. */
export interface Decisions {
  /** `ov_id` of the catalogue lines, or `barcode|title` when there is no id. */
  ignoredLines: ReadonlySet<string>;
}

export interface Match {
  proposal: Proposal;
  item: DbItem;
}

export interface Reconciliation {
  /** Not in the database under any key, nor under a similar name: really new. */
  toAdd: Proposal[];
  /** No key in common, but a similar name in the same collection: probably already there, filed under another key. */
  probable: Match[];
  /** Same key, same item, but filed elsewhere in the database than the file says. */
  moves: Match[];
  /** Same key, clearly another name: one of the two is wrong. */
  conflicts: Match[];
  /** In the database, covered by the file, but not in the file. */
  missing: DbItem[];
  /** Lines the file repeats under one key, after the first. */
  duplicates: Proposal[];
  ignored: Map<string, number>;
  unclassified: Map<string, number>;
  books: number;
  matched: number;
}

const STOP_WORDS = new Set(['le', 'la', 'les', 'l', 'de', 'des', 'du', 'un', 'une', 'et', 'a', 'au', 'aux', 'd', 'en', 'the', 'of', 'and', 'jeu', 'edition', 'n', 'pack']);
const AGE_MENTION = /(\+\s*\d{1,2}\s*ans|a partir de\s*\d{1,2}\s*ans|\(\s*>\s*\d{1,2}\s*ans\s*\))/gi;

const fold = (text: string): string => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(AGE_MENTION, ' ');
const letters = (text: string): string => fold(text).replace(/[^a-z0-9]/g, '');

function tokens(text: string): Set<string> {
  return new Set(fold(text).split(/[^a-z0-9]+/).filter(token => token && !STOP_WORDS.has(token)));
}

function bigrams(text: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (let index = 0; index < text.length - 1; index++) {
    const pair = text.slice(index, index + 2);
    counts.set(pair, (counts.get(pair) ?? 0) + 1);
  }
  return counts;
}

/** Dice coefficient on pairs of letters: forgiving of typos and plurals ("Juste dance" / "Just Dance"). */
function dice(first: string, second: string): number {
  const left = bigrams(first);
  const right = bigrams(second);
  let common = 0;
  left.forEach((count, pair) => (common += Math.min(count, right.get(pair) ?? 0)));
  const total = Math.max(first.length - 1, 0) + Math.max(second.length - 1, 0);
  return total ? (2 * common) / total : 0;
}

/** Names that name the same thing: most words in common, or all the words of the shorter one. */
export function sameName(first: string, second: string): boolean {
  const left = tokens(first);
  const right = tokens(second);
  if (!left.size || !right.size) {
    return false;
  }
  const common = [...left].filter(token => right.has(token)).length;
  const union = left.size + right.size - common;
  return common / union >= 0.6 || (Math.min(left.size, right.size) >= 2 && common / Math.min(left.size, right.size) >= 0.99);
}

/**
 * Looser than `sameName`, for the list a person reads: one name inside the other ("FC26" in "EA Sports FC 26"), a
 * name that differs by a typo or a plural, or two words in common out of a short name.
 */
export function similarName(first: string, second: string): boolean {
  if (sameName(first, second)) {
    return true;
  }
  const left = letters(first);
  const right = letters(second);
  const [short, long] = left.length <= right.length ? [left, right] : [right, left];
  if (short.length >= 4 && long.includes(short)) {
    return true;
  }
  if (dice(left, right) >= 0.82) {
    return true;
  }
  const leftTokens = tokens(first);
  const rightTokens = tokens(second);
  const common = [...leftTokens].filter(token => rightTokens.has(token)).length;
  return common >= 2 && common / Math.min(leftTokens.size, rightTokens.size) >= 0.5;
}

/** Same key but nothing in common in the names: one of the two lines is probably filed under the wrong key. */
function clearlyDifferent(first: string, second: string): boolean {
  const right = tokens(second);
  return !similarName(first, second) && ![...tokens(first)].some(token => right.has(token));
}

/** How a catalogue line is remembered once the user said to stop proposing it. */
export const decisionKey = (record: CatalogueRecord): string => record.id || `${record.barcode}|${record.title}`;
const normalizedKey = (key: string): string => key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

// Board games and outside games are one family: a game can be filed in either and the file does not say which.
const FAMILY: Readonly<Record<Domain, Domain[]>> = {
  boardGames: ['boardGames', 'outsideGames'], outsideGames: ['outsideGames', 'boardGames'], videoGames: ['videoGames'], bricolage: ['bricolage'], photo: ['photo'],
};

// Switch and Switch 2 are one family in the file: it cannot tell them apart.
const sameFamily = (first?: string, second?: string): boolean =>
  first === second || (['switch', 'switch2'].includes(first ?? '') && ['switch', 'switch2'].includes(second ?? ''));

/**
 * Compares a catalogue export with the database. Three tiers, so an item is never proposed twice: the same key,
 * then a similar name in the same collection (listed as probable, never as new), and only then a new item.
 */
export function reconcile(records: ReadonlyArray<CatalogueRecord>, dbItems: ReadonlyArray<DbItem>, decisions: Decisions): Reconciliation {
  const result: Reconciliation = {
    toAdd: [], probable: [], moves: [], conflicts: [], missing: [], duplicates: [],
    ignored: new Map(), unclassified: new Map(), books: 0, matched: 0,
  };
  const byKey = new Map<string, DbItem>(dbItems.map(dbItem => [`${dbItem.domain}:${normalizedKey(dbItem.key)}`, dbItem]));
  const seenKeys = new Set<string>();
  const matchedItems = new Set<DbItem>();
  const count = (map: Map<string, number>, label: string) => map.set(label, (map.get(label) ?? 0) + 1);

  const classified: Array<Classification & {record: CatalogueRecord}> = records.map(record => ({...classify(record), record}));
  for (const entry of classified) {
    if (decisions.ignoredLines.has(decisionKey(entry.record))) {
      count(result.ignored, 'Ne plus proposer (décision enregistrée)');
    } else if (entry.kind === 'ignored') {
      count(result.ignored, entry.reason);
    } else if (entry.kind === 'unclassified') {
      count(result.unclassified, entry.code);
    } else if (entry.kind === 'book') {
      result.books++;
    } else {
      const proposal = entry.proposal;
      const identity = `${proposal.domain}:${normalizedKey(proposal.key)}`;
      if (seenKeys.has(identity)) {
        result.duplicates.push(proposal);
        continue;
      }
      seenKeys.add(identity);
      const keys = FAMILY[proposal.domain].flatMap(domain => [proposal.key, ...proposal.otherKeys].map(key => `${domain}:${normalizedKey(key)}`));
      const found = keys.map(key => byKey.get(key)).find(candidate => candidate && !matchedItems.has(candidate));
      if (found) {
        matchedItems.add(found);
        result.matched++;
        if (clearlyDifferent(proposal.name, found.name) && clearlyDifferent(proposal.record.title, found.name)) {
          result.conflicts.push({proposal, item: found});
        } else if (found.category !== undefined && !sameFamily(found.category, proposal.category) && proposal.domain !== 'boardGames' && proposal.domain !== 'outsideGames') {
          result.moves.push({proposal, item: found});
        }
        continue;
      }
      const similar = dbItems.find(candidate => FAMILY[proposal.domain].includes(candidate.domain) && !matchedItems.has(candidate) && similarName(proposal.name, candidate.name));
      if (similar) {
        matchedItems.add(similar);
        result.probable.push({proposal, item: similar});
      } else {
        result.toAdd.push(proposal);
      }
    }
  }
  const covered = new Set(classified.flatMap(entry => entry.kind === 'item' ? FAMILY[entry.proposal.domain] : []));
  result.missing = dbItems.filter(dbItem => covered.has(dbItem.domain) && !matchedItems.has(dbItem));
  return result;
}
