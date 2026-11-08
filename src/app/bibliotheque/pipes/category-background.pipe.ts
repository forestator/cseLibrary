import {Pipe, PipeTransform, inject} from '@angular/core';
import {Observable, of} from 'rxjs';
import {CloudinaryService} from '../../services/cloudinary.service';

@Pipe({
    name: 'categoryBackground',
    standalone: false
})
export class CategoryBackgroundPipe implements PipeTransform {
  private readonly cloudinary = inject(CloudinaryService);

  transform(libPath: string, bgName: string): Observable<string> {
    return of(this.cloudinary.urlForPath(`assets/books/categoriesBackground/${libPath}/${bgName}`));
  }
}
