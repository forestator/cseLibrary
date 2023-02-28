import {Injectable} from '@angular/core';
import {finalize, Observable} from 'rxjs';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/compat/storage';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/compat/database';
import {FileUpload} from '../../models/fileUpload.model';
import {VideoGame} from '../../models/videoGames.model';
import {OutsideGame} from '../../models/outsideGames.model';
import {BoardGame} from '../../models/boardGame.model';
import {FirebaseDatabaseService} from './firebase-database.service';
import {GamesUtils} from '../../models/gamesUtils';

@Injectable({
  providedIn: 'root'
})
export class StorageUploadService {

  private readonly basePath = '/assets/games/covers/';
  constructor(private db: AngularFireDatabase,
              private firebaseDatabaseService: FirebaseDatabaseService,
              private storage: AngularFireStorage) { }

  pushFileToStorage(fileUpload: FileUpload, gameToUpdate: VideoGame | OutsideGame | BoardGame): Observable<number> {
    const libraryId: string = GamesUtils.libraryIdOfGame(gameToUpdate);
    const fileExtension: string = fileUpload.name.split('.').pop();
    const filePath: string = `${this.basePath}/${libraryId}/${gameToUpdate.name}.${fileExtension}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask: AngularFireUploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.saveFileData(gameToUpdate, fileUpload);
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  private saveFileData(gameToUpdate: VideoGame | OutsideGame | BoardGame, fileUpload: FileUpload): void {
    this.firebaseDatabaseService.updateGameImage(gameToUpdate, fileUpload);
  }

  getFiles(numberItems: number): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, ref =>
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
    return this.db.list(this.basePath).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }
}
