import {ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal} from '@angular/core';
import {Biblio} from '../../../models/author.model';
import {LibraryDialogs} from '../../services/library-dialogs.service';
import {LibraryRepository} from '../../services/library.repository';
import {LibraryEditor} from './library-editor';
import {Crumb, PageHeaderComponent} from '../common/page-header/page-header.component';
import {SkeletonComponent} from '../common/skeleton/skeleton.component';
import {EmptyStateComponent} from '../common/empty-state/empty-state.component';
import {SettingsPanelComponent} from './settings-panel/settings-panel.component';

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrl: './settings-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SettingsPanelComponent, PageHeaderComponent, SkeletonComponent, EmptyStateComponent],
})
export class SettingsViewComponent {
  private readonly repository = inject(LibraryRepository);

  readonly libraryId = input<string>();

  // Edited copy: the shared catalogue displayed by the public pages must not change while editing.
  private readonly biblio = linkedSignal<Biblio | undefined>(() => {
    const source = this.repository.libraryById(this.libraryId());
    return source && structuredClone(source);
  });

  protected readonly crumbs: ReadonlyArray<Crumb> = [{label: 'Bibliothèque', link: '/bibliotheque'}];
  protected readonly title = computed(() => `Gestion : ${this.biblio()?.library.name ?? ''}`);

  protected readonly editor = new LibraryEditor(this.biblio, inject(LibraryDialogs));
}
