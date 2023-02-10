import {Component} from '@angular/core';
import {Library} from '../../../models/author.model';
import boardGame from '../../../../assets/ludo/boardGameLib.json';

@Component({
    selector: 'app-ludotheque',
    templateUrl: './ludotheque.component.html',
    styleUrls: ['./ludotheque.component.scss']
})
export class LudothequeComponent {
    library: Library = boardGame.library as Library;

    constructor() {
    }
}
