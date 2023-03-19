import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Author, Biblio} from '../../models/author.model';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  public adminMode: boolean = false;
  private scrollRetry = 0;

  constructor() {
  }

  getAuthors(authorIds: Array<string | undefined>, biblio: Biblio): Observable<string> {
    return new Observable<string>(observer => {
      const ids: Array<string> = [];
      authorIds?.forEach(item => {
        if (item) {
          ids.push(item);
        }
      });
      let authorNames: string = '';
      let authors = this.getFilteredAuthors(ids, biblio);
      authors.forEach((item, index) => {
        authorNames += `${item.firstName} ${item.lastName}`;
        if (index != authors.length - 1) {
          authorNames += ', ';
        }
      })
      observer.next(authorNames);
    });
  }

  private getFilteredAuthors(authorIds: Array<string>, biblio: Biblio): Array<Author> {
    let authors: Array<Author> = [];
    authorIds?.forEach(authorId => {

      let author: Author | undefined = biblio?.authors?.find(item => item.id === authorId);
      if (author) {
        authors.push(author);
      }
    });
    return authors;
  }

  getPublisher(publisherId: string | undefined, biblio: Biblio): Observable<string> {
    return new Observable<string>(observer => {
      let publisherName: string = '';
      if (publisherId) {
        let publisher = biblio?.publishers?.find(item => item.id === publisherId);
        if (publisher) {
          publisherName = publisher.name;
        }
      }
      observer.next(publisherName);
    });
  }

  scrollToId(id: string | undefined): void {
    if (id) {
      const target: HTMLElement | null = document.getElementById(id);
      if (target) {
        target.scrollIntoView({behavior: 'smooth'});
        this.scrollRetry = 0;
      } else if (this.scrollRetry < 10) {
        this.scrollRetry++;
        setTimeout(() => this.scrollToId(id), 500);
      }
    }
  }
}
