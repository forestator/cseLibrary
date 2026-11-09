import {ChangeDetectionStrategy, Component, input} from '@angular/core';

/** Heading of a block of cards inside a page (`h2`). */
@Component({
  selector: 'app-section-title',
  templateUrl: './section-title.component.html',
  styleUrl: './section-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTitleComponent {
  readonly title = input.required<string>();
  readonly count = input<number>();
}
