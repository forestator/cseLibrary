import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {Category, Library} from '../../../models/author.model';

@Component({
    selector: 'app-ludotheque',
    templateUrl: './ludotheque.component.html',
    styleUrls: ['./ludotheque.component.scss']
})
export class LudothequeComponent implements OnInit {
    library?: Library;
    selectedCategory?: Category;

    constructor(public dataService: DataService) {
    }

    ngOnInit(): void {
        this.library = this.dataService.selectLibrary('ludotheque')?.library;
    }
}
