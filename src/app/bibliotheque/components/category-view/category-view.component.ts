import {Component, OnInit} from '@angular/core';
import {Category, Library, SelectorView, ViewBy} from 'src/app/models/author.model';
import {ToolsService} from 'src/app/services/tools.service';
import {DataService} from '../../../services/data.service';
import {map, Observable} from 'rxjs';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
    selector: 'app-category-view',
    templateUrl: './category-view.component.html',
    styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit {

    library$!: Observable<Library | undefined>;

    private _category!: Category | undefined;
    set category(value: Category | undefined) {
        this._category = value;
        this._category?.series?.forEach(s => {
            console.log('counters')
            this.counter += s.books ? s.books.length : 0;
        });
    }

    get category(): Category | undefined {
        return this._category;
    }

    counter: number = 0;
    VIEW_BY = ViewBy;

    ALPHABET: Array<string> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    constructor(public tools: ToolsService,
                private route: ActivatedRoute,
                public dataService: DataService) {
    }

    ngOnInit(): void {
        this.library$ = this.route.paramMap.pipe(
            map((params: ParamMap) => {
                    const lib = this.dataService.allBiblio
                        .find(biblio => biblio.library?.id === params.get('libraryId')!)?.library;
                    this.category = lib?.categories?.find(cat => cat.id ===  params.get('catId')!);
                return lib;
                }
            ));
    }

    selectSeries(id: string | undefined) {
        if (id) {
            //   this.sendView.emit({mode: ViewMode.BY_SERIES, id: id});
        }
    }

    selectAuthor(selectorView: SelectorView) {
        // this.sendView.emit(selectorView);
    }
}
