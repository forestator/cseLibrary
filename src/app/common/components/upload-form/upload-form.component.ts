import {ChangeDetectionStrategy, Component, computed, input, linkedSignal, output, signal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FileUpload} from '../../../models/fileUpload.model';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrl: './upload-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
})
export class UploadFormComponent {
  readonly defaultImage = input<string>();
  readonly disabled = input<boolean>(false);
  readonly fileToUploadReady = output<FileUpload>();

  protected readonly selectedFile = signal<File | undefined>(undefined);
  protected readonly dragging = signal(false);

  // A new default image or a change of the enabled state discards a previously previewed file.
  protected readonly previewImage = linkedSignal<{image?: string; disabled: boolean}, string | undefined>({
    source: () => ({image: this.defaultImage(), disabled: this.disabled()}),
    computation: () => undefined,
  });

  protected readonly imageSrc = computed(() => this.previewImage() ?? this.defaultImage());
  protected readonly hint = computed(() =>
    this.disabled() ? 'Remplissez les champs du formulaire en premier' : 'Glissez une image ici (PNG ou JPEG)');

  protected selectFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.item(0);
    if (file) {
      this.preview(file);
    }
  }

  protected dropFile(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    const file = event.dataTransfer?.files.item(0);
    if (file && !this.disabled() && file.type.startsWith('image/')) {
      this.preview(file);
    }
  }

  protected dragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(!this.disabled());
  }

  protected upload(): void {
    const file = this.selectedFile();
    if (file) {
      this.selectedFile.set(undefined);
      this.fileToUploadReady.emit(new FileUpload(file));
    }
  }

  private preview(file: File): void {
    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = () => this.previewImage.set(reader.result as string);
    reader.readAsDataURL(file);
  }
}
