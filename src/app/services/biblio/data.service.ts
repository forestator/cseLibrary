import {Injectable} from '@angular/core';
import {Biblio} from '../../models/author.model';
import {FirebaseDatabaseService} from '../firebase/firebase-database.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public allBiblio: Array<Biblio>;
  constructor(private firebaseDatabaseService: FirebaseDatabaseService) {
    this.allBiblio = [];
    this.firebaseDatabaseService.bibliothequeOneShot$.subscribe(allBiblio => {
      this.allBiblio = allBiblio ?? [];
    });
  }

  public log() {
    this.firebaseDatabaseService.bibliothequeOneShot$.subscribe(rep => console.log(rep));
  }
}


