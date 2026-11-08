import {Pipe, PipeTransform, inject} from '@angular/core';
import {Observable, of} from 'rxjs';
import {CloudinaryService} from '../../services/cloudinary.service';

@Pipe({
    name: 'bookCover',
    standalone: false
})
export class BookCoverPipe implements PipeTransform {
  private readonly cloudinary = inject(CloudinaryService);

  transform(libPath: string, coverName: string): Observable<string> {
    return of(this.cloudinary.urlForPath(`assets/books/covers/${libPath}/${coverName}`));
  }
}
