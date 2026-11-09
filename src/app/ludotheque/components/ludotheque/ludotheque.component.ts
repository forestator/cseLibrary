import {Component, ChangeDetectionStrategy} from '@angular/core';
import {AuthentificationService} from '../../../services/firebase/authentification.service';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-ludotheque',
    templateUrl: './ludotheque.component.html',
    styleUrls: ['./ludotheque.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink, AsyncPipe]
})
export class LudothequeComponent {

    constructor(public authService: AuthentificationService) {
    }
}
