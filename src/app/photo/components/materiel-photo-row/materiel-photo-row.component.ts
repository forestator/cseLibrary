import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {ToolsService} from "../../../services/biblio/tools.service";
import {MaterielPhotoItem} from '../../models/materiel-photo.model';

@Component({
    selector: 'app-materiel-photo-row',
    templateUrl: './materiel-photo-row.component.html',
    styleUrls: ['./materiel-photo-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MaterielPhotoRowComponent {
  @Input() item!: MaterielPhotoItem;
  @Input() index!: number;
  @Input() selectedItem?: string;
  parity!: boolean;

  readonly defaultImage = 'https://res.cloudinary.com/seo9axkp/image/upload/assets/materielPhoto/defaultPhoto';
  constructor(public toolsService: ToolsService) {

  }

  ngOnInit() {
    this.parity = this.index % 2 === 0;

    if (this.selectedItem) {
      this.toolsService.scrollToId(this.selectedItem);
    }
  }
}
