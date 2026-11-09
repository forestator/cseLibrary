import {Component, OnChanges, SimpleChanges, ChangeDetectionStrategy, input, output} from '@angular/core';
import {FileUpload} from '../../../models/fileUpload.model';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-upload-form',
    templateUrl: './upload-form.component.html',
    styleUrls: ['./upload-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatButton]
})
export class UploadFormComponent implements OnChanges {
  readonly defaultImage = input<string>(undefined);
  readonly disabled = input<boolean>(undefined);
  readonly fileToUploadReady = output<FileUpload>();
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
    this.fileToUploadReady.emit(new FileUpload(file));
  }
}
