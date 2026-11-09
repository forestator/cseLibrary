import {ChangeDetectionStrategy, Component, input, OnInit, signal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {BookStatusComponent} from '../../common/book-status/book-status.component';
import {SeriesBadgeComponent} from '../../common/series-badge/series-badge.component';
import {SettingsNode} from '../settings-node.model';

let nextPanelId = 0;

/**
 * Expandable entry of the settings tree: header with the edition buttons, a label/value description
 * and its children, rendered recursively. Extra content is projected after the children.
 */
@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrl: './settings-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, BookStatusComponent, SeriesBadgeComponent],
})
export class SettingsPanelComponent implements OnInit {
  readonly node = input.required<SettingsNode>();

  protected readonly bodyId = `settings-panel-${nextPanelId++}`;
  protected readonly open = signal(false);

  // Only the initial state comes from the node: later rebuilds of the tree must not collapse what the user opened.
  ngOnInit(): void {
    this.open.set(this.node().expanded ?? false);
  }
}
