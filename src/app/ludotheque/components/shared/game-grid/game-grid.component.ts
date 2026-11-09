import {ChangeDetectionStrategy, Component, input} from '@angular/core';

/** Responsive grid of cards, with a skeleton while the games load and a calm message when there is none. */
@Component({
  selector: 'app-game-grid',
  templateUrl: './game-grid.component.html',
  styleUrl: './game-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameGridComponent {
  readonly loading = input(false);
  readonly empty = input(false);
  readonly emptyMessage = input('Aucun jeu à afficher pour le moment.');

  protected readonly placeholders = [1, 2, 3, 4, 5, 6];
}
