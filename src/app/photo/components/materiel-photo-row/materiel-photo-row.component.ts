import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import {ToolsService} from "../../../services/biblio/tools.service";
import {MaterielPhotoItem} from '../../models/materiel-photo.model';
import { NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { BadgeComponent } from '../../../common/components/book-badge/badge.component';

@Component({
    selector: 'app-materiel-photo-row',
    templateUrl: './materiel-photo-row.component.html',
    styleUrls: ['./materiel-photo-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgTemplateOutlet, BadgeComponent, AsyncPipe]
})
export class MaterielPhotoRowComponent {
  toolsService = inject(ToolsService);

  @Input() item!: MaterielPhotoItem;
  @Input() index!: number;
  @Input() selectedItem?: string;
  parity!: boolean;

  readonly defaultImage = 'https://res.cloudinary.com/seo9axkp/image/upload/assets/materielPhoto/defaultPhoto';

  ngOnInit() {
    this.parity = this.index % 2 === 0;

    if (this.selectedItem) {
      this.toolsService.scrollToId(this.selectedItem);
    }
  }
}
