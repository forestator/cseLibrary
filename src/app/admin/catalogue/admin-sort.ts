import {AdminItem} from './admin-collection.model';

export type AdminSortColumn = 'cover' | 'name' | 'collection' | 'category' | 'ref' | 'status';
export type AdminSortDirection = 'asc' | 'desc';

export interface AdminSort {
  column: AdminSortColumn;
  direction: AdminSortDirection;
}

/** A row of the global list: the item and the labels it is shown with. */
export interface AdminRow {
  item: AdminItem;
  collectionLabel: string;
  categoryLabel: string;
  statusLabel: string;
}

// Numeric, accent- and case-insensitive: "ludo96" comes before "ludo342", "é" sorts with "e".
const collator = new Intl.Collator('fr', {numeric: true, sensitivity: 'base'});

function valueOf(row: AdminRow, column: AdminSortColumn): string {
  switch (column) {
    case 'cover': return row.item.cover ? '1' : '0';
    case 'name': return row.item.name;
    case 'collection': return row.collectionLabel;
    case 'category': return row.categoryLabel;
    case 'ref': return row.item.ref ?? '';
    case 'status': return row.statusLabel;
  }
}

/** The rows ordered by a column; empty values always come last, whatever the direction. Without a sort, the rows are left as they are. */
export function sortRows(rows: ReadonlyArray<AdminRow>, sort: AdminSort | null): AdminRow[] {
  if (!sort) {
    return [...rows];
  }
  const sign = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((first, second) => {
    const firstValue = valueOf(first, sort.column);
    const secondValue = valueOf(second, sort.column);
    if (!firstValue || !secondValue) {
      return Number(!firstValue) - Number(!secondValue);
    }
    return sign * collator.compare(firstValue, secondValue);
  });
}

/** The sort after a click on a column header: ascending, then descending, then back to the default order. */
export function nextSort(current: AdminSort | null, column: AdminSortColumn): AdminSort | null {
  if (current?.column !== column) {
    return {column, direction: 'asc'};
  }
  return current.direction === 'asc' ? {column, direction: 'desc'} : null;
}
