import {Injectable} from '@angular/core';
import {Author, Biblio, SeriesStatus, ViewBy} from '../models/author.model';
import imgLib from '../../assets/imgLib.json';
import romLib from '../../assets/romLib.json';
import kidsLib from '../../assets/kidsLib.json';
import incLib from '../../assets/incLib.json';
import ps4VideoGames from '../../assets/ludo/videoGames/jeuxPs4.json';
import switchVideoGames from '../../assets/ludo/videoGames/jeuxSwitch.json';
import ps5VideoGames from '../../assets/ludo/videoGames/jeuxPs5.json';
import xboxOneGames from '../../assets/ludo/videoGames/jeuxXboxOne.json';
import {VideoGame, VideoGamesLibs} from '../models/videoGames.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public allBiblio: Array<Biblio>;
  public selectedLib!: Biblio | undefined;
  public videoGames: VideoGamesLibs;

  constructor() {
    this.allBiblio = [];

    // let tmp: Biblio = imgLib as Biblio;
    // tmp.publishers?.forEach(item => {
    //    item.by = tmp.library?.by;
    // })
    // tmp.authors?.forEach(item => {
    //    item.by = tmp.library?.by;
    // })
    // console.log('tmp', tmp);

    this.videoGames = {
      switch: switchVideoGames as Array<VideoGame>,
      ps4: ps4VideoGames as Array<VideoGame>,
      ps5: ps5VideoGames as Array<VideoGame>,
      xboxOne: xboxOneGames as Array<VideoGame>,
    };

    this.allBiblio.push(imgLib as Biblio);
    this.allBiblio.push(romLib as Biblio);
    this.allBiblio.push(kidsLib as Biblio);
    this.allBiblio.push(incLib as Biblio);
    this.selectedLib = this.allBiblio[0];
    this.log();
  }

  public selectLibrary(id: string | undefined) {
    this.selectedLib = this.allBiblio.find(item => item.library?.id === id);
    return this.selectedLib;
  }

  // public filterLib(lib: Biblio): Biblio {
  //    let filteredLib: Biblio = {};
  //    if (this.tools.adminMode) {
  //       filteredLib = lib;
  //    } else {
  //       filteredLib = {
  //          authors: lib.authors,
  //          publishers: lib.publishers,
  //          library: lib.library
  //       };

  //       lib.library?.categories?.forEach(c => {
  //          c.series?.forEach(s => {
  //             s.books?.forEach(b => {

  //             })
  //          })
  //       })
  //    }
  //    return filteredLib;
  // }
  public getAuthors(authorIds: Array<string>): Array<Author> {
    let authors: Array<Author> = [];
    authorIds?.forEach(authorId => {
      let author: Author | undefined = this.selectedLib?.authors?.find(item => item.id === authorId);
      if (author) {
        authors.push(author);
      }
    });
    return authors;
  }

  public log() {
    this.selectedLib?.authors?.sort((a, b) => {
      return a.lastName > b.lastName ? 1 : a.lastName < b.lastName ? -1 : 0;
    });
    this.selectedLib?.publishers?.sort((a, b) => {
      return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
    });
    if (this.selectedLib?.library?.by === ViewBy.BY_SERIES) {
      this.selectedLib.library.categories?.forEach(c => {
        c.series?.sort((a, b) => {
          if (a.status === SeriesStatus.ONE_SHOT) {
            return -1;
          } else if (b.status === SeriesStatus.ONE_SHOT) {
            return 1;
          } else {
            return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
          }
        })
      })
    }
    console.log('LOG:', this.selectedLib);
  }

  getVideoGamesOfCategory(consoleId: string): Array<VideoGame> {
    // @ts-ignore
    return this.videoGames[consoleId] as Array<VideoGame>;
  }
}


