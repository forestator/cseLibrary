import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';

const ALPHABET: ReadonlyArray<string> = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

/** Sticky letter bar; choosing the selected letter again clears the filter. */
@Component({
  selector: 'app-alphabet',
  templateUrl: './alphabet.component.html',
  styleUrl: './alphabet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlphabetComponent {
  readonly selected = input<string>();
  readonly filterByLetter = output<string | undefined>();

  protected readonly letters = ALPHABET;

  protected choose(letter: string): void {
    this.filterByLetter.emit(letter === this.selected() ? undefined : letter);
  }
}
