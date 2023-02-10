import {Component, Input, OnInit} from '@angular/core';
import {Series} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/data.service';
import {ToolsService} from 'src/app/services/tools.service';

@Component({
  selector: 'app-series-row',
  templateUrl: './series-row.component.html',
  styleUrls: ['./series-row.component.scss']
})
export class SeriesRowComponent implements OnInit {
  @Input()
  series!: Series | undefined;

  bookColumns: Array<string> = ['cover', 'title', 'authors', 'tome', 'isbn', 'page', 'status'];

  constructor(public tools: ToolsService, public dataService: DataService) { }

  ngOnInit(): void {

  }
}
