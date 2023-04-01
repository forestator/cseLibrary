import {Component, Input, OnInit} from '@angular/core';
import {ToolsService} from '../../../services/biblio/tools.service';
import {Tool} from '../../models/bricolage.model';

@Component({
  selector: 'app-tool-row',
  templateUrl: './tool-row.component.html',
  styleUrls: ['./tool-row.component.scss']
})
export class ToolRowComponent implements OnInit {

  @Input() tool!: Tool;
  @Input() index!: number;
  @Input() selectedTool?: string;
  parity!: boolean;

  defaultImage = 'https://firebasestorage.googleapis.com/v0/b/cseh-50966.appspot.com/o/assets%2Fbricolage%2F886a62acec77b09e8f37f72cb957da99%5B1%5D.jpg?alt=media&token=265aeac8-5453-4a36-9dba-ba8032564e7e';

  constructor(public toolsService: ToolsService) {
  }

  ngOnInit() {
    this.parity = this.index % 2 === 0;

    if (this.selectedTool) {
      this.toolsService.scrollToId(this.selectedTool);
    }
  }

}
