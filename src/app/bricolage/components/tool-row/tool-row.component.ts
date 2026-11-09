import { Component, OnInit, ChangeDetectionStrategy, inject, input } from '@angular/core';
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
  toolsService = inject(ToolsService);


  readonly tool = input.required<Tool>();
  readonly index = input.required<number>();
  readonly selectedTool = input<string>(undefined);
  parity!: boolean;

  readonly defaultImage = 'https://res.cloudinary.com/seo9axkp/image/upload/assets/tools/covers/defaultTool';

  ngOnInit() {
    this.parity = this.index() % 2 === 0;

    const selectedTool = this.selectedTool();
    if (selectedTool) {
      this.toolsService.scrollToId(selectedTool);
    }
  }

}
