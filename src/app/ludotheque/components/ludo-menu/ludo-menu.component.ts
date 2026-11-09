import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SearchInLibComponent} from '../search-in-lib/search-in-lib.component';

@Component({
  selector: 'app-ludo-menu',
  templateUrl: './ludo-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchInLibComponent],
})
export class LudoMenuComponent {
}
