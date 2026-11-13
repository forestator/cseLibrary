export type AdminFieldKind = 'text' | 'textarea' | 'number' | 'select' | 'status' | 'checkbox';

export interface AdminFieldOption {
  value: string;
  label: string;
}

/** One input of the item form. A dotted `key` (`dimensions.longueur`) addresses a nested stored field. */
export interface AdminField {
  key: string;
  label: string;
  kind: AdminFieldKind;
  required?: boolean;
  placeholder?: string;
  /** For `select` and `status`. */
  options?: ReadonlyArray<AdminFieldOption>;
}

export interface AdminFormSection {
  id: string;
  title: string;
  fields: ReadonlyArray<AdminField>;
}

export type AdminFormValue = string | number | boolean | null;
export type AdminFormValues = Record<string, AdminFormValue>;
