import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FileUpload} from '../../../models/fileUpload.model';

@Component({
    selector: 'app-upload-form',
    templateUrl: './upload-form.component.html',
    styleUrls: ['./upload-form.component.scss'],
    standalone: false
})
export class UploadFormComponent implements OnChanges {
  @Input() defaultImage?: string;
  @Input() disabled?: boolean;
  @Output() fileToUploadReady = new EventEmitter<FileUpload>();
  selectedFile?: File;
  previewImage?: string | ArrayBuffer;

  ngOnChanges(changes: SimpleChanges) {
    this.previewImage = null;
  }

  selectFile(event: any): void {
    this.selectedFile = event.target.files.item(0);
    const reader = new FileReader();
    reader.onload = () => this.previewImage = reader.result;
    reader.readAsDataURL(this.selectedFile);
  }

  upload(): void {
    const file = this.selectedFile;
    this.selectedFile = null;
    this.fileToUploadReady.next(new FileUpload(file));
  }
}
