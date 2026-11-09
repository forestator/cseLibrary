import { Component, OnInit, ChangeDetectionStrategy, inject, input } from '@angular/core';
import {ToolsService} from "../../../services/biblio/tools.service";
import {SonoItem} from "../../models/sono.model";
import { NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { BadgeComponent } from '../../../common/components/book-badge/badge.component';

@Component({
    selector: 'app-sono-item-row',
    templateUrl: './sono-item-row.component.html',
    styleUrls: ['./sono-item-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgTemplateOutlet, BadgeComponent, AsyncPipe]
})
export class SonoItemRowComponent implements OnInit {
  toolsService = inject(ToolsService);


  readonly sonoItem = input.required<SonoItem>();
  readonly index = input.required<number>();
  readonly selectedSonoItemId = input<string>(undefined);
  parity!: boolean;

  readonly defaultImage = 'https://res.cloudinary.com/seo9axkp/image/upload/assets/sonoItems/defaultSonoIItem';

  ngOnInit() {
    this.parity = this.index() % 2 === 0;

    const selectedSonoItemId = this.selectedSonoItemId();
    if (selectedSonoItemId) {
      this.toolsService.scrollToId(selectedSonoItemId);
    }
  }
}
