import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {ToolsService} from "../../../services/biblio/tools.service";
import {NautismeItem} from "../../models/nautisme.model";

@Component({
    selector: 'app-nautisme-item-row',
    templateUrl: './nautisme-item-row.component.html',
    styleUrls: ['./nautisme-item-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NautismeItemRowComponent {
  @Input() item!: NautismeItem;
  @Input() index!: number;
  @Input() selectedItem?: string;
  parity!: boolean;

  readonly defaultImage = 'https://res.cloudinary.com/seo9axkp/image/upload/assets/nautismeItems/nautismeDefaultImage';
  constructor(public toolsService: ToolsService) {

  }

  ngOnInit() {
    this.parity = this.index % 2 === 0;

    if (this.selectedItem) {
      this.toolsService.scrollToId(this.selectedItem);
    }
  }
}
