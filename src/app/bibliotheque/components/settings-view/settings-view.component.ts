import {ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, signal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
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
  imports: [MatButton, MatIcon, SettingsPanelComponent, PageHeaderComponent, SkeletonComponent, EmptyStateComponent],
})
export class SettingsViewComponent {
  private readonly repository = inject(LibraryRepository);
  private readonly snackBar = inject(MatSnackBar);

  readonly libraryId = input<string>();

  // Edited copy: the shared catalogue displayed by the public pages only changes once the edits are saved.
  private readonly source = computed(() => this.repository.libraryById(this.libraryId()));
  private readonly biblio = linkedSignal<Biblio | undefined>(() => {
    const source = this.source();
    return source && structuredClone(source);
  });

  protected readonly crumbs: ReadonlyArray<Crumb> = [{label: 'Bibliothèque', link: '/bibliotheque'}];
  protected readonly title = computed(() => `Gestion : ${this.biblio()?.library.name ?? ''}`);

  protected readonly saving = signal(false);
  protected readonly hasChanges = computed(() => JSON.stringify(this.biblio()) !== JSON.stringify(this.source()));

  protected readonly editor = new LibraryEditor(this.biblio, inject(LibraryDialogs));

  protected discard(): void {
    const source = this.source();
    this.biblio.set(source && structuredClone(source));
  }

  protected async save(): Promise<void> {
    const edited = this.biblio();
    if (!edited || this.saving()) {
      return;
    }
    this.saving.set(true);
    try {
      await this.repository.save(edited.library.id ?? this.libraryId() ?? '', edited);
      this.snackBar.open('Modifications enregistrées', 'Fermer', {duration: 4000});
    } catch (error) {
      console.error('Unable to save the library', error);
      this.snackBar.open('Enregistrement impossible : vérifiez votre connexion et vos droits', 'Fermer', {duration: 8000});
    } finally {
      this.saving.set(false);
    }
  }
}
