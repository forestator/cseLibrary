import {inject, Pipe, PipeTransform} from '@angular/core';
import {CloudinaryService} from '../../services/cloudinary.service';

@Pipe({name: 'bookCover'})
export class BookCoverPipe implements PipeTransform {
  private readonly cloudinary = inject(CloudinaryService);

  transform(libraryPath?: string, coverName?: string): string {
    return this.cloudinary.urlForPath(`assets/books/covers/${libraryPath}/${coverName}`);
  }
}
