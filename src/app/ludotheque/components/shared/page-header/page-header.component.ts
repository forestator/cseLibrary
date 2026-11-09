import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

/** Header of every ludotheque page: the only `h1` of the page, with an optional way back to the parent page. */
@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, RouterLink],
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly resume = input<string>();
  readonly count = input<string>();
  readonly backLink = input<string>();
  readonly backLabel = input<string>();
}
