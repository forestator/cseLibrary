import {AdminFormValues} from '../form/admin-form.model';
import {Domain, Proposal} from './catalogue-classification';
import {DbItem} from './reconcile';

/** What the user chose to add: the proposal, with the name and the category as they may have corrected them. */
export interface Addition {
  proposal: Proposal;
  name: string;
  category: string;
}

/** An addition with the key it will really get (the proposed one when it is free). */
export interface PlannedAddition extends Addition {
  key: string;
}

const letters = (key: string): string => key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

// Game references are unique across the three kinds of games; tools and photo items only within their commission.
const SPACE: Readonly<Record<Domain, string>> = {
  boardGames: 'games', videoGames: 'games', outsideGames: 'games', bricolage: 'bricolage', photo: 'photo',
};

/** The key itself when free, else the first of `key-2`, `key-3`… that is. Nothing already there is ever overwritten. */
export function uniqueKey(key: string, taken: ReadonlySet<string>): string {
  if (!taken.has(letters(key))) {
    return key;
  }
  for (let attempt = 2; ; attempt++) {
    if (!taken.has(letters(`${key}-${attempt}`))) {
      return `${key}-${attempt}`;
    }
  }
}

/** Gives every addition its key, checked against the database and against the other additions of the same batch. */
export function planAdditions(additions: ReadonlyArray<Addition>, existing: ReadonlyArray<DbItem>): PlannedAddition[] {
  const taken = new Map<string, Set<string>>();
  for (const item of existing) {
    const space = SPACE[item.domain];
    taken.set(space, (taken.get(space) ?? new Set()).add(letters(item.key)));
  }
  return additions.map(addition => {
    const space = SPACE[addition.proposal.domain];
    const used = taken.get(space) ?? new Set<string>();
    taken.set(space, used);
    const key = uniqueKey(addition.proposal.key, used);
    used.add(letters(key));
    return {...addition, key};
  });
}

/** The form values the collection of the domain writes for an addition: old stock, so not a novelty. */
export function additionValues(addition: PlannedAddition): AdminFormValues {
  const {domain, type} = addition.proposal;
  if (domain === 'bricolage' || domain === 'photo') {
    return {name: addition.name, id: addition.key, categoryId: addition.category, status: 'AVAILABLE', description: ''};
  }
  return {
    name: addition.name, ref: addition.key, category: addition.category, status: 'AVAILABLE', isNew: false,
    ...(domain === 'videoGames' ? {type: type ?? 'GAME'} : {}),
  };
}

export function groupByDomain<T>(items: ReadonlyArray<T>, domainOf: (item: T) => Domain): Map<Domain, T[]> {
  const groups = new Map<Domain, T[]>();
  for (const item of items) {
    const domain = domainOf(item);
    groups.set(domain, [...(groups.get(domain) ?? []), item]);
  }
  return groups;
}
