import {MatDialogConfig} from '@angular/material/dialog';

/** Wide form dialogs shrink to the viewport on small screens. */
export const ADMIN_DIALOG_CONFIG: Pick<MatDialogConfig, 'width' | 'maxWidth'> = {
  width: '960px',
  maxWidth: '96vw',
};

export const ADMIN_PICKER_DIALOG_CONFIG: Pick<MatDialogConfig, 'width' | 'maxWidth'> = {
  width: '560px',
  maxWidth: '96vw',
};
