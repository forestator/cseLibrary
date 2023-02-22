import {Component} from '@angular/core';
import {AuthentificationService} from '../../../services/firebase/authentification.service';

@Component({
    selector: 'app-ludotheque',
    templateUrl: './ludotheque.component.html',
    styleUrls: ['./ludotheque.component.scss']
})
export class LudothequeComponent {

    constructor(public authService: AuthentificationService) {
    }
}
