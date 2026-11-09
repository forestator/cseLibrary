import {Pipe, PipeTransform} from '@angular/core';
import {Biblio} from '../../models/author.model';
import {authorNames} from '../models/library-queries';

@Pipe({name: 'authorNames'})
export class AuthorNamesPipe implements PipeTransform {
  transform(authorIds?: ReadonlyArray<string | undefined>, biblio?: Biblio): string {
    return authorNames(authorIds, biblio);
  }
}
