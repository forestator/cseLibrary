import {FormControl, FormRecord} from '@angular/forms';

export type DialogForm = FormRecord<FormControl<string>>;

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  options?: ReadonlyArray<FormFieldOption>;
  /** Two consecutive half fields share one row. */
  half?: boolean;
}

export interface FormDialogAction {
  icon: string;
  label: string;
  run: (form: DialogForm) => void;
}

export interface FormDialogData {
  title: string;
  icon: string;
  /** Fields whose live values are appended to the title (edition dialogs). */
  titleKeys?: ReadonlyArray<string>;
  fields: ReadonlyArray<FormField>;
  values: Readonly<Record<string, string>>;
  /** Shows the cover held by the given field next to the form. */
  cover?: {key: string; libraryPath?: string};
  extraActions?: ReadonlyArray<FormDialogAction>;
}

export type FormValues = Record<string, string>;
