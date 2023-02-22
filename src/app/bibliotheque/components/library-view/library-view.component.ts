import {Component, OnInit} from '@angular/core';
import {Library} from 'src/app/models/author.model';
import {map, Observable} from 'rxjs';
import {Params} from '@angular/router';
import {DataService} from '../../../services/biblio/data.service';
import {NavigationService} from '../../../services/navigation.service';

@Component({
    selector: 'app-library-view',
    templateUrl: './library-view.component.html',
    styleUrls: ['./library-view.component.scss']
})
export class LibraryViewComponent implements OnInit {

    library$!: Observable<Library | undefined>;

    constructor(private dataService: DataService, private navigationService: NavigationService) {
    }

    ngOnInit() {
        this.library$ = this.navigationService.getRouteParams().pipe(
            map((params: Params) => {
                return this.dataService.allBiblio
                        .find(biblio => biblio.library?.id === params['libraryId']!)?.library;
                }
            ));
    }
}
