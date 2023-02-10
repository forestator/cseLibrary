import {Component} from '@angular/core';
import {XmlParserService} from './services/xml-parser.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Cse';
    constructor(
        private xmlParser: XmlParserService) {

        this.xmlParser.loadXML('assets/IMG.xml').subscribe(biblio => {
            //   // this.dataService.selectedLib = biblio;
            //   // this.library = biblio.library;
            //   // this.category = this.library?.categories?.[0];
        });
    }
}
