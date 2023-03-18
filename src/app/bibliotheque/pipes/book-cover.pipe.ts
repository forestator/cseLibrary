import {Pipe, PipeTransform} from '@angular/core';
import {BiblioDatabaseService} from '../services/biblio-database.service';
import {Observable} from 'rxjs';

@Pipe({
  name: 'bookCover'
})
export class BookCoverPipe implements PipeTransform {

  constructor(private biblioDatabaseService: BiblioDatabaseService) {
  }

  transform(libPath: string, coverName: string): Observable<string> {
    return this.biblioDatabaseService.getCoverUrl(libPath, coverName);
  }

}
