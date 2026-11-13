import {AdminFieldOption} from '../form/admin-form.model';

/** Statuses of the games, which have no per-commission list like the catalogue items. */
export const ITEM_STATUSES: ReadonlyArray<AdminFieldOption> = [
  {value: 'AVAILABLE', label: 'Disponible'},
  {value: 'REPARATION', label: 'En réparation'},
  {value: 'HS', label: 'Hors service'},
  {value: 'MISSING', label: 'Perdu'},
];
