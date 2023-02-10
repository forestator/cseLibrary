import {Component, OnInit} from '@angular/core';
import {ViewMode} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/data.service';
import {ToolsService} from 'src/app/services/tools.service';
import {NavigationStart, Router} from '@angular/router';
import boardGamCats from '../../../assets/ludo/boardGameLib.json'

@Component({
    selector: 'app-library-menu',
    templateUrl: './library-menu.component.html',
    styleUrls: ['./library-menu.component.scss']
})
export class LibraryMenuComponent implements OnInit {

    public menu: Array<{ name: string, route: string }> = [];
    public VIEW_MODES = ViewMode;
    title: string = 'Cse';
    prefixRoute: string = '';

    constructor(private dataService: DataService,
                private router: Router,
                public tools: ToolsService) {
    }

    ngOnInit(): void {
        this.router.events.subscribe((route) => {
            if (route instanceof NavigationStart) {
                this.handleUrlChange(route.url);
            }
        });
    }

    public toggleAdminMode() {
        this.tools.adminMode = !this.tools.adminMode;
        console.log('adminMode', this.tools.adminMode);
    }

    public selectView(view: ViewMode, id: string | undefined) {
    }

    private handleUrlChange(url: string) {
        if (url.includes('bibliotheque')) {
            this.menu = this.dataService.allBiblio.map((item) => {
                return {name: item.library!.name, route: item.library!.id!};
            });
            this.title = 'Bibliotheque';
            this.prefixRoute = 'bibliotheque/';
        } else if (url.includes('ludotheque')) {
            this.menu = boardGamCats.library.categories.map(cat => {
                return {name: cat.name, route: cat.id};
            });
            this.title = 'Ludotheque';
            this.prefixRoute = 'ludotheque/';
        } else {
            this.menu = [];
            this.title = 'Cse';
            this.prefixRoute = '/';
        }
    }
}
