import {Component, OnInit} from '@angular/core';
import {Library} from 'src/app/models/author.model';
import {map, Observable} from 'rxjs';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {DataService} from '../../../services/data.service';

@Component({
    selector: 'app-library-view',
    templateUrl: './library-view.component.html',
    styleUrls: ['./library-view.component.scss']
})
export class LibraryViewComponent implements OnInit {

    library$!: Observable<Library | undefined>;

    constructor(private dataService: DataService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.library$ = this.route.paramMap.pipe(
            map((params: ParamMap) => {
                return this.dataService.allBiblio
                        .find(biblio => biblio.library?.id === params.get('id')!)?.library;
                }
            ));
    }
}
