import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Biblio, Series} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import {ToolsService} from 'src/app/services/biblio/tools.service';

@Component({
    selector: 'app-series-row',
    templateUrl: './series-row.component.html',
    styleUrls: ['./series-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SeriesRowComponent implements OnInit {
  @Input()
  series!: Series | undefined;

  @Input()
  biblio!: Biblio;

  bookColumns: Array<string> = ['cover', 'title', 'authors', 'tome', 'isbn', 'page', 'status'];

  constructor(public tools: ToolsService, public dataService: DataService) { }

  ngOnInit(): void {

  }
}
