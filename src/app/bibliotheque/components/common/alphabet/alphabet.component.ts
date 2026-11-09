import {Component, OnInit, ChangeDetectionStrategy, output} from '@angular/core';

@Component({
    selector: 'app-alphabet',
    templateUrl: './alphabet.component.html',
    styleUrls: ['./alphabet.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class AlphabetComponent implements OnInit {

  readonly filterByLetter = output<string>();

  ALPHABET: Array<string> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  constructor() { }

  ngOnInit(): void {
  }

}
