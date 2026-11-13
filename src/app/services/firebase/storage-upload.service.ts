import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {CloudinaryService, CloudinaryUploadState} from '../cloudinary.service';

/** Uploads cover images to Cloudinary. It only reports the URL: writing it down is up to whoever saves the item. */
@Injectable({
  providedIn: 'root'
})
export class StorageUploadService {
  private readonly cloudinary = inject(CloudinaryService);

  /** `folder/name` becomes the public id (with a timestamp: unsigned uploads cannot overwrite an asset). */
  uploadCover(file: File, folder: string, name: string): Observable<CloudinaryUploadState> {
    const path = `${folder}/${name}`.replace(/^\//, '').replace(/\.[^./]+$/, '');
    const publicId = `${path.replace(/[^\w/-]+/g, '_')}-${Date.now()}`;
    return this.cloudinary.upload(file, publicId);
  }
}
