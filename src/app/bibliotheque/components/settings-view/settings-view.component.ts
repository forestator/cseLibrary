import {ChangeDetectionStrategy, Component, inject, input, linkedSignal} from '@angular/core';
import {Biblio} from '../../../models/author.model';
import {LibraryDialogs} from '../../services/library-dialogs.service';
import {LibraryRepository} from '../../services/library.repository';
import {LibraryEditor} from './library-editor';
import {SettingsPanelComponent} from './settings-panel/settings-panel.component';

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrl: './settings-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SettingsPanelComponent],
})
export class SettingsViewComponent {
  private readonly repository = inject(LibraryRepository);

  /** Route parameter. */
  readonly libraryId = input<string>();

  // Edited copy: the shared catalogue displayed by the public pages must not change while editing.
  private readonly biblio = linkedSignal<Biblio | undefined>(() => {
    const source = this.repository.libraryById(this.libraryId());
    return source && structuredClone(source);
  });

  protected readonly editor = new LibraryEditor(this.biblio, inject(LibraryDialogs));
}
