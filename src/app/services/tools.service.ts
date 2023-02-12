import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  public adminMode: boolean = false;
  private scrollRetry = 0;

  constructor(private dataService: DataService) {
  }

  getAuthors(authorIds: Array<string | undefined>): Observable<string> {
    return new Observable<string>(observer => {
      const ids: Array<string> = [];
      authorIds.forEach(item => {
        if (item) {
          ids.push(item);
        }
      });
      let authorNames: string = '';
      let authors = this.dataService.getAuthors(ids);
      authors.forEach((item, index) => {
        authorNames += `${item.firstName} ${item.lastName}`;
        if (index != authors.length - 1) {
          authorNames += ', ';
        }
      })
      observer.next(authorNames);
    });
  }

  getPublisher(publisherId: string | undefined): Observable<string> {
    return new Observable<string>(observer => {
      let publisherName: string = '';
      if (publisherId) {
        let publisher = this.dataService.selectedLib?.publishers?.find(item => item.id === publisherId);
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
