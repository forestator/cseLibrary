import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FileUpload} from '../../../models/fileUpload.model';
import {StorageUploadService} from '../../../services/firebase/storage-upload.service';
import {Game} from '../../../models/common.model';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnChanges {
  @Input() selectedGame: Game;
  selectedFile?: File;
  currentFileUpload: FileUpload;
  percentage?: number;
  previewImage?: string | ArrayBuffer;

  constructor(private uploadService: StorageUploadService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.previewImage = null;
    this.currentFileUpload = null;
  }

  selectFile(event: any): void {
    this.selectedFile = event.target.files.item(0);
    const reader = new FileReader();
    reader.onload = e => this.previewImage = reader.result;
    reader.readAsDataURL(this.selectedFile);
  }

  upload(): void {
    const file = this.selectedFile;
    this.selectedFile = null;

    this.currentFileUpload = new FileUpload(file);
    this.uploadService.pushFileToStorage(this.currentFileUpload, this.selectedGame).subscribe(
      percentage => {
        this.percentage = Math.round(percentage);
      }
    );
  }
}
