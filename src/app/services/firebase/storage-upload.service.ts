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

@Injectable({
  providedIn: 'root'
})
export class StorageUploadService {

  private readonly gameBasePath = '/assets/games/covers/';
  private readonly bricoBasePath = '/assets/tools/covers/';
  private readonly sonoBasePath = '/assets/sonoItems/covers/';
  constructor(private db: AngularFireDatabase,
              private firebaseDatabaseService: FirebaseDatabaseService,
              private bricolageDatabaseService: BricolageDatabaseService,
              private sonoDatabaseService: SonoDatabaseService,
              private storage: AngularFireStorage) { }

  uploadGameCover(fileUpload: FileUpload, gameToUpdate: VideoGame | Game | BoardGame): Observable<number> {
    const libraryId: string = GamesUtils.libraryIdOfGame(gameToUpdate);
    const fileExtension: string = fileUpload.name.split('.').pop();
    const filePath: string = `${this.gameBasePath}/${libraryId}/${gameToUpdate.name}.${fileExtension}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask: AngularFireUploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().pipe(take(1)).subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.firebaseDatabaseService.updateGameImage(gameToUpdate, fileUpload);
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  getFiles(numberItems: number): AngularFireList<FileUpload> {
    return this.db.list(this.gameBasePath, ref =>
      ref.limitToLast(numberItems));
  }

  deleteFile(fileUpload: FileUpload): void {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }

  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.gameBasePath).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.gameBasePath);
    storageRef.child(name).delete();
  }

  uploadToolCover(fileUpload: FileUpload, tool: Tool): Observable<number> {
    const fileExtension: string = fileUpload.name.split('.').pop();
    const filePath: string = `${this.bricoBasePath}/${tool.categoryId}/${tool.name}.${fileExtension}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask: AngularFireUploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().pipe(take(1)).subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.bricolageDatabaseService.updateToolCover(tool, fileUpload);
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  uploadSonoItemCover(fileUpload: FileUpload, item: SonoItem) {
    const fileExtension: string = fileUpload.name.split('.').pop();
    const filePath: string = `${this.sonoBasePath}/${item.category}/${item.name}.${fileExtension}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask: AngularFireUploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().pipe(take(1)).subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.sonoDatabaseService.updateItemCover(item, fileUpload);
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }
}
