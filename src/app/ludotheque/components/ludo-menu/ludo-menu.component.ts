import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import { SearchInLibComponent } from '../search-in-lib/search-in-lib.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-ludo-menu',
    templateUrl: './ludo-menu.component.html',
    styleUrls: ['./ludo-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [SearchInLibComponent, AsyncPipe]
})
export class LudoMenuComponent {
  constructor(public firebaseDatabaseService: FirebaseDatabaseService) {
  }
}
