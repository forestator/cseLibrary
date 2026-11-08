import {HttpClient, HttpEventType} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable, filter, map} from 'rxjs';
import {environment} from '../../environments/environment';

export interface CloudinaryUploadState {
  progress: number;
  url?: string;
}

interface CloudinaryUploadResponse {
  secure_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private readonly http = inject(HttpClient);
  private readonly config = environment.cloudinary;
  private readonly deliveryBaseUrl = `https://res.cloudinary.com/${this.config.cloudName}/image/upload`;

  /**
   * Public URL of an asset whose public id mirrors its former Firebase Storage path
   * (kept for assets migrated with scripts/migrate-storage).
   */
  urlForPath(path: string): string {
    return `${this.deliveryBaseUrl}/${path}`;
  }

  /**
   * Unsigned uploads cannot overwrite an asset, so callers must provide a unique public id.
   */
  upload(file: File, publicId: string): Observable<CloudinaryUploadState> {
    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', this.config.uploadPreset);
    body.append('public_id', publicId);

    return this.http.post<CloudinaryUploadResponse>(
      `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`,
      body,
      {reportProgress: true, observe: 'events'}
    ).pipe(
      filter(event => event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Response),
      map(event => {
        if (event.type === HttpEventType.Response) {
          return {progress: 100, url: event.body?.secure_url};
        }
        return {progress: event.total ? Math.round(100 * event.loaded / event.total) : 0};
      })
    );
  }
}
