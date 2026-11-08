import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {ToolsService} from "../../../services/biblio/tools.service";
import {SonoItem} from "../../models/sono.model";

@Component({
    selector: 'app-sono-item-row',
    templateUrl: './sono-item-row.component.html',
    styleUrls: ['./sono-item-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SonoItemRowComponent implements OnInit {

  @Input() sonoItem!: SonoItem;
  @Input() index!: number;
  @Input() selectedSonoItemId?: string;
  parity!: boolean;

  readonly defaultImage = 'https://res.cloudinary.com/seo9axkp/image/upload/assets/sonoItems/defaultSonoIItem';
  constructor(public toolsService: ToolsService) {

  }

  ngOnInit() {
    this.parity = this.index % 2 === 0;

    if (this.selectedSonoItemId) {
      this.toolsService.scrollToId(this.selectedSonoItemId);
    }
  }
}
