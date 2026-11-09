import {ChangeDetectionStrategy, Component, output} from '@angular/core';

const ALPHABET: ReadonlyArray<string> = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

@Component({
  selector: 'app-alphabet',
  templateUrl: './alphabet.component.html',
  styleUrl: './alphabet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlphabetComponent {
  readonly filterByLetter = output<string>();

  protected readonly letters = ALPHABET;
}
