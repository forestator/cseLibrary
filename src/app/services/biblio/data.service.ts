import {Injectable} from '@angular/core';
import {Author, Biblio, SeriesStatus, ViewBy} from '../../models/author.model';
import {FirebaseDatabaseService} from '../firebase/firebase-database.service';
import {take} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public allBiblio: Array<Biblio>;
  public selectedLib!: Biblio | undefined;

  constructor(private firebaseDatabaseService: FirebaseDatabaseService) {
    this.allBiblio = [];
    this.firebaseDatabaseService.bibliotheque$.pipe(take(1)).subscribe(allBiblio => {
      this.allBiblio = allBiblio;
      this.selectedLib = this.allBiblio[0];
      this.log();
    });
  }

  public getAuthors(authorIds: Array<string>): Array<Author> {
    let authors: Array<Author> = [];
    authorIds?.forEach(authorId => {
      let author: Author | undefined = this.selectedLib?.authors?.find(item => item.id === authorId);
      if (author) {
        authors.push(author);
      }
    });
    return authors;
  }

  public log() {
    this.selectedLib?.authors?.sort((a, b) => {
      return a.lastName > b.lastName ? 1 : a.lastName < b.lastName ? -1 : 0;
    });
    this.selectedLib?.publishers?.sort((a, b) => {
      return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
    });
    if (this.selectedLib?.library?.by === ViewBy.BY_SERIES) {
      this.selectedLib.library.categories?.forEach(c => {
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
    console.log('LOG:', this.selectedLib);
  }
}


