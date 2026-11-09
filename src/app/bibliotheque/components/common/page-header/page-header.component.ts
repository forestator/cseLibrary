import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';

export interface Crumb {
  label: string;
  link: string | ReadonlyArray<string>;
}

/** Hero of every library page: breadcrumbs, the page `h1`, counters and an optional resume. */
@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly resume = input<string>();
  readonly crumbs = input<ReadonlyArray<Crumb>>([]);
  /** Short facts displayed under the title, such as "12 livres". */
  readonly facts = input<ReadonlyArray<string>>([]);
}
