import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import {ToolsService} from "../../../services/biblio/tools.service";
import {NautismeItem} from "../../models/nautisme.model";
import { NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { BadgeComponent } from '../../../common/components/book-badge/badge.component';

@Component({
    selector: 'app-nautisme-item-row',
    templateUrl: './nautisme-item-row.component.html',
    styleUrls: ['./nautisme-item-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgTemplateOutlet, BadgeComponent, AsyncPipe]
})
export class NautismeItemRowComponent {
  toolsService = inject(ToolsService);

  @Input() item!: NautismeItem;
  @Input() index!: number;
  @Input() selectedItem?: string;
  parity!: boolean;

  readonly defaultImage = 'https://res.cloudinary.com/seo9axkp/image/upload/assets/nautismeItems/nautismeDefaultImage';

  ngOnInit() {
    this.parity = this.index % 2 === 0;

    if (this.selectedItem) {
      this.toolsService.scrollToId(this.selectedItem);
    }
  }
}
