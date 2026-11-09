import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {GamesRepository} from '../../services/games.repository';
import {GameCardComponent} from '../shared/game-card/game-card.component';
import {GameGridComponent} from '../shared/game-grid/game-grid.component';
import {PageHeaderComponent} from '../shared/page-header/page-header.component';

@Component({
  selector: 'app-games-list',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GameCardComponent, GameGridComponent, PageHeaderComponent],
})
export class GameComponent {
  /** Game to scroll to, from the route `ludotheque/outsideGames/:id`. */
  readonly id = input<string>();

  private readonly repository = inject(GamesRepository);

  protected readonly library = toSignal(this.repository.loadLibrary$('outsideGames'));
  protected readonly games = toSignal(this.repository.watchGames$('outsideGames'));
  protected readonly count = computed(() => {
    const total = this.games()?.length;
    return total ? `${total} jeu${total > 1 ? 'x' : ''}` : undefined;
  });
}
