import {Component, ChangeDetectionStrategy} from '@angular/core';
import {AuthentificationService} from '../../../services/firebase/authentification.service';

@Component({
    selector: 'app-ludotheque',
    templateUrl: './ludotheque.component.html',
    styleUrls: ['./ludotheque.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LudothequeComponent {

    constructor(public authService: AuthentificationService) {
    }
}
