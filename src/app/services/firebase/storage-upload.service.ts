import {Injectable} from '@angular/core';
import {finalize, Observable, take} from 'rxjs';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/compat/storage';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/compat/database';
import {FileUpload} from '../../models/fileUpload.model';
import {VideoGame} from '../../models/videoGames.model';
import {BoardGame} from '../../models/boardGame.model';
import {FirebaseDatabaseService} from './firebase-database.service';
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
  private readonly basePath = {
    game: '/assets/games/covers',
    brico: '/assets/tools/covers',
    sono: '/assets/sonoItems/covers',
    nautisme: '/assets/nautisme/covers'
  };

  constructor(
    private db: AngularFireDatabase,
    private firebaseDatabaseService: FirebaseDatabaseService,
    private bricolageDatabaseService: BricolageDatabaseService,
    private sonoDatabaseService: SonoDatabaseService,
    private nautismeDatabaseService: NautismeDatabaseService,
    private storage: AngularFireStorage
  ) {
  }

  uploadCover(fileUpload: FileUpload, basePath: string, filePath: string,
              itemToUpdate: Game | Tool | SonoItem | NautismeItem): Observable<number> {
    const storageRef = this.storage.ref(filePath);
    const uploadTask: AngularFireUploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().pipe(take(1)).subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.updateItemCover(basePath, fileUpload, itemToUpdate);
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  private updateItemCover(basePath: string, fileUpload: FileUpload, itemToUpdate: Game | Tool | SonoItem | NautismeItem): void {
    switch (basePath) {
      case this.basePath.game:
        this.firebaseDatabaseService.updateGameImage(itemToUpdate as Game, fileUpload);
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

  getFiles(numberItems: number): AngularFireList<FileUpload> {
    return this.db.list(this.basePath.game, ref => ref.limitToLast(numberItems));
  }

  deleteFile(fileUpload: FileUpload): void {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }

  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.basePath.game).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath.game);
    storageRef.child(name).delete();
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
