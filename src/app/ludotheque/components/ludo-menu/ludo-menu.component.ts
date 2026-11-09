import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SearchInLibComponent} from '../search-in-lib/search-in-lib.component';

@Component({
  selector: 'app-ludo-menu',
  templateUrl: './ludo-menu.component.html',
  styleUrl: './ludo-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchInLibComponent],
})
export class LudoMenuComponent {
}
