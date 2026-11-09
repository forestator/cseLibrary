import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {BadgeComponent} from '../../../../common/components/book-badge/badge.component';
import {SeriesBadgeComponent} from '../../common/series-badge/series-badge.component';
import {SettingsNode} from '../settings-node.model';

/**
 * Expandable entry of the settings tree: header with the edition buttons, a label/value description
 * and its children, rendered recursively. Extra content is projected after the children.
 */
@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrl: './settings-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatExpansionModule, MatIcon, BadgeComponent, SeriesBadgeComponent],
})
export class SettingsPanelComponent {
  readonly node = input.required<SettingsNode>();
}
