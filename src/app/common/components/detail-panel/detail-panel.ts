import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogClose} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {DetailPanelData} from './detail-panel.model';

@Component({
  selector: 'app-detail-panel',
  templateUrl: './detail-panel.html',
  styleUrl: './detail-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatIconButton, MatDialogClose, NgOptimizedImage],
})
export class DetailPanel {
  protected readonly data = inject<DetailPanelData>(MAT_DIALOG_DATA);
}
