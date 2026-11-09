import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {GamesRepository} from '../../services/games.repository';
import {GameRowComponent} from '../game-row/game-row.component';

@Component({
  selector: 'app-games-list',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GameRowComponent],
})
export class GameComponent {
  /** Game to scroll to, from the route `ludotheque/outsideGames/:id`. */
  readonly id = input<string>();

  private readonly repository = inject(GamesRepository);

  protected readonly library = toSignal(this.repository.loadLibrary$('outsideGames'));
  protected readonly games = toSignal(this.repository.watchGames$('outsideGames'));
}
