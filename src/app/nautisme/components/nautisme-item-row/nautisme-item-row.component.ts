import {Component, Input} from '@angular/core';
import {ToolsService} from "../../../services/biblio/tools.service";
import {NautismeItem} from "../../models/nautisme.model";

@Component({
  selector: 'app-nautisme-item-row',
  templateUrl: './nautisme-item-row.component.html',
  styleUrls: ['./nautisme-item-row.component.scss']
})
export class NautismeItemRowComponent {
  @Input() item!: NautismeItem;
  @Input() index!: number;
  @Input() selectedItem?: string;
  parity!: boolean;

  readonly defaultImage = 'https://firebasestorage.googleapis.com/v0/b/cseh-50966.appspot.com/o/assets%2FnautismeItems%2FnautismeDefaultImage.jpg?alt=media&token=72117134-24d6-433a-8257-3ec4572c7e4c';
  constructor(public toolsService: ToolsService) {

  }

  ngOnInit() {
    this.parity = this.index % 2 === 0;

    if (this.selectedItem) {
      this.toolsService.scrollToId(this.selectedItem);
    }
  }
}
