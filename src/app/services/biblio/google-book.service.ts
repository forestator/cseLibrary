import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleBookService {

  private isbnUrl: string = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';
  private titleUrl: string = 'https://www.googleapis.com/books/v1/volumes?q=intitle:';

  constructor(private http: HttpClient) {

  }

  getBookByIsbn(isbn: string): Observable<any> {
    return this.http.get(`${this.isbnUrl}${isbn}`);
  }

  getBookByTitle(title: string): Observable<any> {
    return this.http.get(`${this.titleUrl}${title}`);
  }
}
