import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {ToolsService} from '../../../services/biblio/tools.service';
import {Tool} from '../../models/bricolage.model';
import { NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { BadgeComponent } from '../../../common/components/book-badge/badge.component';

@Component({
    selector: 'app-tool-row',
    templateUrl: './tool-row.component.html',
    styleUrls: ['./tool-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgTemplateOutlet, BadgeComponent, AsyncPipe]
})
export class ToolRowComponent implements OnInit {

  @Input() tool!: Tool;
  @Input() index!: number;
  @Input() selectedTool?: string;
  parity!: boolean;

  readonly defaultImage = 'https://res.cloudinary.com/seo9axkp/image/upload/assets/tools/covers/defaultTool';
  constructor(public toolsService: ToolsService) {

  }

  ngOnInit() {
    this.parity = this.index % 2 === 0;

    if (this.selectedTool) {
      this.toolsService.scrollToId(this.selectedTool);
    }
  }

}
