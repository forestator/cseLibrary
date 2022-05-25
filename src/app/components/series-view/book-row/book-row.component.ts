import { Component, Input, OnInit } from '@angular/core';
import { Book } from 'src/app/models/author.model';
import { DataService } from 'src/app/services/data.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-book-row',
  templateUrl: './book-row.component.html',
  styleUrls: ['./book-row.component.scss']
})
export class BookRowComponent implements OnInit {

  @Input()
  book!: Book;

  @Input()
  index!: number;

  parity!: boolean;
  constructor(public tools: ToolsService, public dataService: DataService) { }

  ngOnInit(): void {
    this.parity = this.index % 2 === 0;
  }
}
