import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'app-catalogue-page-header',
  templateUrl: './catalogue-page-header.html',
  styleUrl: './catalogue-page-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CataloguePageHeader {
  readonly title = input<string>();
  readonly resume = input<string>();
  /** Label of the counter chip, e.g. "12 objets". */
  readonly countLabel = input<string>();
}
