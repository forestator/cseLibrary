import {Component, Input, OnInit} from '@angular/core';
import {Library, Series} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import {ToolsService} from 'src/app/services/biblio/tools.service';

@Component({
  selector: 'app-series-row',
  templateUrl: './series-row.component.html',
  styleUrls: ['./series-row.component.scss']
})
export class SeriesRowComponent implements OnInit {
  @Input()
  series!: Series | undefined;

  @Input()
  library!: Library;

  bookColumns: Array<string> = ['cover', 'title', 'authors', 'tome', 'isbn', 'page', 'status'];

  constructor(public tools: ToolsService, public dataService: DataService) { }

  ngOnInit(): void {

  }
}
