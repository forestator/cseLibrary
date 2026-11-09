import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {SearchBookResult} from '../../models/author.model';

interface GoogleVolumeInfo {
  title?: string;
  description?: string;
  authors?: Array<string>;
  industryIdentifiers?: Array<{type: string; identifier: string}>;
  pageCount?: number;
  publisher?: string;
  publishedDate?: string;
}

interface GoogleBooksResponse {
  items?: Array<{volumeInfo?: GoogleVolumeInfo}>;
}

const VOLUMES_URL = 'https://www.googleapis.com/books/v1/volumes?q=';

@Injectable({providedIn: 'root'})
export class GoogleBookService {
  private readonly http = inject(HttpClient);

  searchByIsbn(isbn: string): Observable<Array<SearchBookResult>> {
    return this.search(`isbn:${isbn}`);
  }

  searchByTitle(title: string): Observable<Array<SearchBookResult>> {
    return this.search(`intitle:${title}`);
  }

  private search(query: string): Observable<Array<SearchBookResult>> {
    return this.http.get<GoogleBooksResponse>(`${VOLUMES_URL}${query}`).pipe(
      map(response =>
        (response.items ?? [])
          .map(item => item.volumeInfo)
          .filter((info): info is GoogleVolumeInfo => !!info)
          .map(info => this.toSearchResult(info))
      )
    );
  }

  private toSearchResult(info: GoogleVolumeInfo): SearchBookResult {
    const identifier = (type: string) => info.industryIdentifiers?.find(item => item.type === type)?.identifier ?? '';
    return {
      title: info.title ?? '',
      resume: info.description ?? '',
      authors: info.authors?.join(',') ?? '',
      isbn10: identifier('ISBN_10'),
      isbn13: identifier('ISBN_13'),
      page: info.pageCount?.toString() ?? '',
      publisher: info.publisher ?? '',
      publishedDate: info.publishedDate ?? '',
      format: '',
      tome: '',
    };
  }
}
