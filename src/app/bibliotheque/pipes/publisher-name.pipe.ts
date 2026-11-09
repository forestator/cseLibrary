import {Pipe, PipeTransform} from '@angular/core';
import {Biblio} from '../../models/author.model';
import {publisherName} from '../models/library-queries';

@Pipe({name: 'publisherName'})
export class PublisherNamePipe implements PipeTransform {
  transform(publisherId?: string, biblio?: Biblio): string {
    return publisherName(publisherId, biblio);
  }
}
