import {Component, Input, OnInit} from '@angular/core';
import {Book, Category, Library} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import {ToolsService} from 'src/app/services/biblio/tools.service';

@Component({
  selector: 'app-book-row',
  templateUrl: './book-row.component.html',
  styleUrls: ['./book-row.component.scss']
})
export class BookRowComponent implements OnInit {

  @Input()
  book!: Book;

  @Input()
  category!: Category;

  @Input()
  index!: number;

  @Input()
  library!: Library;

  parity!: boolean;
  badge!: string;
  constructor(public tools: ToolsService, public dataService: DataService) { }

  ngOnInit(): void {
    this.parity = this.index % 2 === 0;
    if (this.category) {
      this.badge = this.category.name === 'Science fiction' ? 'S.F.' : this.category.name;
    }
  }
}
