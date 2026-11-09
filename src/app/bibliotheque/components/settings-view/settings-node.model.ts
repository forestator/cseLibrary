import {BookStatus, Series} from '../../../models/author.model';

export interface SettingsNodeAction {
  icon: string;
  /** Accessible name of the button, also shown as tooltip. */
  label: string;
  tone: 'edit' | 'delete' | 'add';
  run: () => void;
}

export interface SettingsNodeField {
  label: string;
  value?: string;
  /** Renders the value as a book status badge. */
  bookStatus?: BookStatus;
  /** Renders the value as a series status badge. */
  series?: Series;
}

/** One expandable entry of the settings tree (category, series, book, author or publisher). */
export interface SettingsNode {
  id: string;
  title: string;
  bookStatus?: BookStatus;
  expanded?: boolean;
  fields: ReadonlyArray<SettingsNodeField>;
  actions: ReadonlyArray<SettingsNodeAction>;
  children: ReadonlyArray<SettingsNode>;
}

/** Button of the library header selecting the section displayed below it. */
export interface SettingsTile {
  key: string;
  title: string;
  info: string;
  selection: SettingsSelection;
}

export type SettingsSelection = {kind: 'category'; id?: string} | {kind: 'authors'} | {kind: 'publishers'};
