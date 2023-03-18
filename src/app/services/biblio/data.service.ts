import {Injectable} from '@angular/core';
import {Author, Biblio, SeriesStatus, ViewBy} from '../../models/author.model';
import {FirebaseDatabaseService} from '../firebase/firebase-database.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public allBiblio: Array<Biblio>;
  constructor(private firebaseDatabaseService: FirebaseDatabaseService) {
    this.allBiblio = [];
    this.firebaseDatabaseService.bibliothequeStream$.subscribe(allBiblio => {
      this.allBiblio = allBiblio ?? [];
    });
  }

  getCurrentBiblio(libId: string): Biblio {
    return this.allBiblio.find(b => b.library.id === libId)!;
  }

  public getAuthors(authorIds: Array<string>, libId: string): Array<Author> {
    let authors: Array<Author> = [];
    authorIds?.forEach(authorId => {

      let author: Author | undefined = this.getCurrentBiblio(libId)?.authors?.find(item => item.id === authorId);
      if (author) {
        authors.push(author);
      }
    });
    return authors;
  }

  public log(libId?: string) {
    this.getCurrentBiblio(libId)?.authors?.sort((a, b) => {
      return a.lastName > b.lastName ? 1 : a.lastName < b.lastName ? -1 : 0;
    });
    this.getCurrentBiblio(libId)?.publishers?.sort((a, b) => {
      return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
    });
    if (this.getCurrentBiblio(libId)?.library?.by === ViewBy.BY_SERIES) {
      this.getCurrentBiblio(libId).library.categories?.forEach(c => {
        c.series?.sort((a, b) => {
          if (a.status === SeriesStatus.ONE_SHOT) {
            return -1;
          } else if (b.status === SeriesStatus.ONE_SHOT) {
            return 1;
          } else {
            return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
          }
        })
      })
    }
    console.log('LOG:', this.getCurrentBiblio(libId));
  }
}


