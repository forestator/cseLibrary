import {inject, Pipe, PipeTransform} from '@angular/core';
import {CloudinaryService} from '../../services/cloudinary.service';

// Existing asset shared by the libraries whose categories have no dedicated background.
const DEFAULT_BACKGROUND = 'assets/books/categoriesBackground/img/backgroundImg.jpg';

@Pipe({name: 'categoryBackground'})
export class CategoryBackgroundPipe implements PipeTransform {
  private readonly cloudinary = inject(CloudinaryService);

  transform(libraryPath?: string, backgroundName?: string): string {
    return this.cloudinary.urlForPath(
      backgroundName ? `assets/books/categoriesBackground/${libraryPath}/${backgroundName}` : DEFAULT_BACKGROUND
    );
  }
}
