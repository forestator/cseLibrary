import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';

@Component({
    selector: 'app-ludo-menu',
    templateUrl: './ludo-menu.component.html',
    styleUrls: ['./ludo-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LudoMenuComponent {
  constructor(public firebaseDatabaseService: FirebaseDatabaseService) {
  }
}
