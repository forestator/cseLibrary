import {ChangeDetectionStrategy, Component, output} from '@angular/core';

const ALPHABET: ReadonlyArray<string> = Array.from({length: 26}, (_, offset) => String.fromCharCode(65 + offset));

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
