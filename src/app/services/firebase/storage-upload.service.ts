import { Injectable, inject } from '@angular/core';
import {Observable, map, shareReplay, tap} from 'rxjs';
import {CloudinaryService} from '../cloudinary.service';
import {FileUpload} from '../../models/fileUpload.model';
import {VideoGame} from '../../models/videoGames.model';
import {BoardGame} from '../../models/boardGame.model';
import {GamesRepository} from '../../ludotheque/services/games.repository';
import {GamesUtils} from '../../models/gamesUtils';
import {Game} from '../../models/common.model';
import {CatalogueItem} from '../../catalogue/models/catalogue-item.model';
import {CommissionConfig} from '../../catalogue/models/commission-config.model';
import {CatalogueRepositories} from '../../catalogue/services/catalogue-repositories.service';

@Injectable({
  providedIn: 'root'
})
export class StorageUploadService {
  private cloudinary = inject(CloudinaryService);
  private gamesRepository = inject(GamesRepository);
  private catalogueRepositories = inject(CatalogueRepositories);

  private readonly gameCoverPath = '/assets/games/covers';

  private uploadCover(fileUpload: FileUpload, filePath: string,
                      onUploaded: (fileUpload: FileUpload) => void): Observable<number> {
    // A timestamp keeps the public id unique: unsigned Cloudinary uploads cannot overwrite an asset.
    const pathWithoutExtension = filePath.replace(/^\//, '').replace(/\.[^./]+$/, '');
    const publicId = `${pathWithoutExtension.replace(/[^\w/-]+/g, '_')}-${Date.now()}`;

    const progress$ = this.cloudinary.upload(fileUpload.file, publicId).pipe(
      tap(state => {
        if (state.url) {
          fileUpload.url = state.url;
          fileUpload.name = fileUpload.file.name;
          onUploaded(fileUpload);
        }
      }),
      map(state => state.progress),
      shareReplay({bufferSize: 1, refCount: false})
    );
    // Callers only read the progress, so the upload must start even when nobody subscribes.
    progress$.subscribe({error: error => console.error('Cover upload failed', error)});
    return progress$;
  }

  private getFileExtenion(fileUpload: FileUpload) {
    return fileUpload.name.split('.').pop();
  }

  uploadGameCover(fileUpload: FileUpload, gameToUpdate: VideoGame | Game | BoardGame): Observable<number> {
    const libraryId: string = GamesUtils.libraryIdOfGame(gameToUpdate);
    const fileExtension = this.getFileExtenion(fileUpload);
    const filePath: string = `${this.gameCoverPath}/${libraryId}/${gameToUpdate.name}.${fileExtension}`;

    return this.uploadCover(fileUpload, filePath,
      uploaded => this.gamesRepository.updateCover(gameToUpdate as Game, uploaded.url));
  }

  uploadItemCover(config: CommissionConfig, fileUpload: FileUpload, item: CatalogueItem): Observable<number> {
    const fileExtension = this.getFileExtenion(fileUpload);
    const folder = config.categories ? `${config.admin.coverPath}/${item.categoryId}` : config.admin.coverPath;
    const filePath: string = `${folder}/${item.name}.${fileExtension}`;

    return this.uploadCover(fileUpload, filePath,
      uploaded => this.catalogueRepositories.of(config).updateCover(item, uploaded.url));
  }
}
