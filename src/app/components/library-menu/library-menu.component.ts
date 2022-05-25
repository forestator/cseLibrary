import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Library, SelectorView, ViewMode } from 'src/app/models/author.model';
import { DataService } from 'src/app/services/data.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-library-menu',
  templateUrl: './library-menu.component.html',
  styleUrls: ['./library-menu.component.scss']
})
export class LibraryMenuComponent implements OnInit {

  private _library: Library | undefined;
  private readonly newProperty = this;

  @Input('library')
  set library(value: Library | undefined) {
    this._library = value;
    //build menu
    this.menu = [];
    this.newProperty.dataService.allBiblio.forEach(item => {
      if (item.library?.id !== this.library?.id) {
        this.menu.push({ name: item.library?.name, id: item.library?.id });
      }
    });
    console.log('menu: ', this.menu);
  };
  get library(): Library | undefined {
    return this._library;
  };

  @Output() sendView = new EventEmitter<SelectorView>();

  public menu: Array<{ name: string | undefined, id: string | undefined }> = [];
  public VIEW_MODES = ViewMode;
  constructor(private dataService: DataService, public tools: ToolsService) { }

  ngOnInit(): void {

  }

  public toggleAdminMode() {
    this.tools.adminMode = !this.tools.adminMode;
    console.log('adminMode', this.tools.adminMode);
  }
  
  public selectView(view: ViewMode, id: string | undefined) {
    this.sendView.emit({mode: view, id: id});
  }
}
