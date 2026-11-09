import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {
  MatAccordion, MatExpansionPanel, MatExpansionPanelContent, MatExpansionPanelDescription, MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {firstValueFrom} from 'rxjs';
import {CataloguePageHeader} from '../../../../catalogue/components/catalogue-page-header/catalogue-page-header';
import {countLabel} from '../../../../catalogue/models/count-label';
import {ADMIN_DIALOG_CONFIG, ADMIN_PICKER_DIALOG_CONFIG} from '../../../admin-dialog.config';
import {GamesRepository} from '../../../../ludotheque/services/games.repository';
import {LudoTableComponent} from '../ludo-table/ludo-table.component';
import {AddGameModalComponent} from './add-game-modal/add-game-modal.component';
import {EditGameModalComponent} from './edit-game-modal/edit-game-modal.component';

@Component({
  selector: 'app-admin-games',
  templateUrl: './admin-games.component.html',
  styleUrl: './admin-games.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle,
    MatExpansionPanelDescription, MatExpansionPanelContent, LudoTableComponent, CataloguePageHeader],
})
export class AdminGamesComponent {
  private readonly repository = inject(GamesRepository);
  private readonly dialog = inject(MatDialog);

  private readonly boardGames = toSignal(this.repository.loadGames$('boardGames'));
  private readonly videoGames = toSignal(this.repository.loadGames$('videoGames'));
  private readonly outsideGames = toSignal(this.repository.loadGames$('outsideGames'));

  protected readonly sections = computed(() => [
    {title: 'BoardGames', columns: ['category', 'name', 'poids', 'ref'], games: this.boardGames()},
    {title: 'VideoGames', columns: ['category', 'name', 'ref'], games: this.videoGames()},
    {title: 'OutsideGames', columns: ['category', 'name', 'ref'], games: this.outsideGames()},
  ].map(section => ({...section, countLabel: section.games ? countLabel(section.games.length) : 'Chargement…'})));

  protected async addGame(): Promise<void> {
    const games = await firstValueFrom(this.repository.loadAllGames$());
    this.dialog.open(AddGameModalComponent, {data: {games}, ...ADMIN_DIALOG_CONFIG});
  }

  protected async editGame(): Promise<void> {
    const games = await firstValueFrom(this.repository.loadAllGames$());
    this.dialog.open(EditGameModalComponent, {data: {games}, ...ADMIN_PICKER_DIALOG_CONFIG});
  }
}
