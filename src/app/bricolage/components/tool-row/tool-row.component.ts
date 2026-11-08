import {Component, Input, OnInit} from '@angular/core';
import {ToolsService} from '../../../services/biblio/tools.service';
import {Tool} from '../../models/bricolage.model';

@Component({
    selector: 'app-tool-row',
    templateUrl: './tool-row.component.html',
    styleUrls: ['./tool-row.component.scss'],
    standalone: false
})
export class ToolRowComponent implements OnInit {

  @Input() tool!: Tool;
  @Input() index!: number;
  @Input() selectedTool?: string;
  parity!: boolean;

  readonly defaultImage = 'https://firebasestorage.googleapis.com/v0/b/cseh-50966.appspot.com/o/assets%2Ftools%2Fcovers%2FdefaultTool.jpg?alt=media&token=165e5ad1-3d3f-477a-a7d7-72cf49c8eaa4';
  constructor(public toolsService: ToolsService) {

  }

  ngOnInit() {
    this.parity = this.index % 2 === 0;

    if (this.selectedTool) {
      this.toolsService.scrollToId(this.selectedTool);
    }
  }

}
