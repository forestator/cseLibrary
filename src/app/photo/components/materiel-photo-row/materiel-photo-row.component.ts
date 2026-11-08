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

  readonly defaultImage = 'https://firebasestorage.googleapis.com/v0/b/cseh-50966.appspot.com/o/assets%2FmaterielPhoto%2FdefaultPhoto.jpg?alt=media&token=5e723ad3-91ec-419a-85dd-975b8a059506';
  constructor(public toolsService: ToolsService) {

  }

  ngOnInit() {
    this.parity = this.index % 2 === 0;

    if (this.selectedItem) {
      this.toolsService.scrollToId(this.selectedItem);
    }
  }
}
