import {Component, Input} from '@angular/core';
import {FileUpload} from '../../../models/fileUpload.model';
import {StorageUploadService} from '../../../services/firebase/storage-upload.service';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent {
  @Input() selectedGame: any;
  selectedFile?: File;
  currentFileUpload: FileUpload;
  percentage: number;
  previewImage?: string | ArrayBuffer;

  constructor(private uploadService: StorageUploadService) {
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
