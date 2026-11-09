import { Injectable, inject } from '@angular/core';
import {Observable, map, shareReplay, tap} from 'rxjs';
import {CloudinaryService} from '../cloudinary.service';
import {FileUpload} from '../../models/fileUpload.model';
import {VideoGame} from '../../models/videoGames.model';
import {BoardGame} from '../../models/boardGame.model';
import {GamesRepository} from '../../ludotheque/services/games.repository';
import {GamesUtils} from '../../models/gamesUtils';
import {Game} from '../../models/common.model';
import {Tool} from "../../bricolage/models/bricolage.model";
import {BricolageDatabaseService} from "../../bricolage/services/bricolage-database.service";
import {SonoItem} from "../../sonotheque/models/sono.model";
import {SonoDatabaseService} from "../../sonotheque/services/sono-database.service";
import {NautismeItem} from '../../nautisme/models/nautisme.model';
import {NautismeDatabaseService} from '../../nautisme/services/nautisme-database.service';

@Injectable({
  providedIn: 'root'
})
export class StorageUploadService {
  private cloudinary = inject(CloudinaryService);
  private gamesRepository = inject(GamesRepository);
  private bricolageDatabaseService = inject(BricolageDatabaseService);
  private sonoDatabaseService = inject(SonoDatabaseService);
  private nautismeDatabaseService = inject(NautismeDatabaseService);

  private readonly basePath = {
    game: '/assets/games/covers',
    brico: '/assets/tools/covers',
    sono: '/assets/sonoItems/covers',
    nautisme: '/assets/nautisme/covers'
  };

  uploadCover(fileUpload: FileUpload, basePath: string, filePath: string,
              itemToUpdate: Game | Tool | SonoItem | NautismeItem): Observable<number> {
    // A timestamp keeps the public id unique: unsigned Cloudinary uploads cannot overwrite an asset.
    const pathWithoutExtension = filePath.replace(/^\//, '').replace(/\.[^./]+$/, '');
    const publicId = `${pathWithoutExtension.replace(/[^\w/-]+/g, '_')}-${Date.now()}`;

    const progress$ = this.cloudinary.upload(fileUpload.file, publicId).pipe(
      tap(state => {
        if (state.url) {
          fileUpload.url = state.url;
          fileUpload.name = fileUpload.file.name;
          this.updateItemCover(basePath, fileUpload, itemToUpdate);
        }
      }),
      map(state => state.progress),
      shareReplay({bufferSize: 1, refCount: false})
    );
    // Callers only read the progress, so the upload must start even when nobody subscribes.
    progress$.subscribe({error: error => console.error('Cover upload failed', error)});
    return progress$;
  }

  private updateItemCover(basePath: string, fileUpload: FileUpload, itemToUpdate: Game | Tool | SonoItem | NautismeItem): void {
    switch (basePath) {
      case this.basePath.game:
        this.gamesRepository.updateCover(itemToUpdate as Game, fileUpload.url);
        break;
      case this.basePath.brico:
        this.bricolageDatabaseService.updateToolCover(itemToUpdate as Tool, fileUpload);
        break;
      case this.basePath.sono:
        this.sonoDatabaseService.updateItemCover(itemToUpdate as SonoItem, fileUpload);
        break;
      case this.basePath.nautisme:
        this.nautismeDatabaseService.updateItemCover(itemToUpdate as NautismeItem, fileUpload);
        break;
    }
  }

  private getFileExtenion(fileUpload: FileUpload) {
    return fileUpload.name.split('.').pop();
  }

  uploadGameCover(fileUpload: FileUpload, gameToUpdate: VideoGame | Game | BoardGame): Observable<number> {
    const libraryId: string = GamesUtils.libraryIdOfGame(gameToUpdate);
    const fileExtension = this.getFileExtenion(fileUpload);
    const filePath: string = `${this.basePath.game}/${libraryId}/${gameToUpdate.name}.${fileExtension}`;

    return this.uploadCover(fileUpload, this.basePath.game, filePath, gameToUpdate);
  }

  uploadToolCover(fileUpload: FileUpload, tool: Tool): Observable<number> {
    const fileExtension = this.getFileExtenion(fileUpload);
    const filePath: string = `${this.basePath.brico}/${tool.categoryId}/${tool.name}.${fileExtension}`;

    return this.uploadCover(fileUpload, this.basePath.brico, filePath, tool);
  }

  uploadSonoItemCover(fileUpload: FileUpload, item: SonoItem) {
    const fileExtension = this.getFileExtenion(fileUpload);
    const filePath: string = `${this.basePath.sono}/${item.category}/${item.name}.${fileExtension}`;

    return this.uploadCover(fileUpload, this.basePath.sono, filePath, item);
  }

  uploadNautCover(fileUpload: FileUpload, item: NautismeItem) {
    const fileExtension = this.getFileExtenion(fileUpload);
    const filePath: string = `${this.basePath.nautisme}/${item.name}.${fileExtension}`;

    return this.uploadCover(fileUpload, this.basePath.nautisme, filePath, item);
  }
}
