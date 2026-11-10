import {Injectable, inject} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DetailPanel} from './detail-panel';
import {DetailPanelData} from './detail-panel.model';

/** Opens the detail panel; only one panel exists at a time. */
@Injectable({providedIn: 'root'})
export class DetailPanelService {
  private readonly dialog = inject(MatDialog);
  private current?: MatDialogRef<DetailPanel>;

  open(data: DetailPanelData): void {
    this.current?.close();
    this.current = this.dialog.open(DetailPanel, {
      data,
      panelClass: 'detail-panel-overlay',
      position: {top: '0', right: '0'},
      height: '100dvh',
      width: '480px',
      maxWidth: '100vw',
      autoFocus: 'dialog',
      restoreFocus: true,
      ariaLabelledBy: 'detail-panel-title',
    });
  }
}
