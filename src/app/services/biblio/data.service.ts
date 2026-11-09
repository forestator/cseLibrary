import { Injectable, inject } from '@angular/core';
import {Biblio} from '../../models/author.model';
import {FirebaseDatabaseService} from '../firebase/firebase-database.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firebaseDatabaseService = inject(FirebaseDatabaseService);

  public allBiblio: Array<Biblio>;
  constructor() {
    this.allBiblio = [];
    this.firebaseDatabaseService.bibliothequeOneShot$.subscribe(allBiblio => {
      this.allBiblio = allBiblio ?? [];
    });
  }

  public log() {
    this.firebaseDatabaseService.bibliothequeOneShot$.subscribe(rep => console.log(rep));
  }
}


