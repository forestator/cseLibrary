import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Author, Biblio, Book, Category, Library, Publisher, Series, ViewBy} from '../models/author.model';
import * as xml2js from 'xml2js';
import {v4 as uuidv4} from 'uuid';
import {DataService} from './data.service';

@Injectable({
   providedIn: 'root'
})
export class XmlParserService {
   constructor(private http: HttpClient, private dataService: DataService) { }

   public static extractAuthor(aut: string | undefined): Author | undefined {
      if (aut) {
         let authorTokens: Array<string> = aut.trim().split(' ');
         return {
            firstName: authorTokens[authorTokens.length - 1],
            lastName: authorTokens.slice(0, authorTokens.length - 1).join(' '),
         }
      }
      return undefined;
   }

   public static extractPublisher(pub: string | undefined): string {
      if (pub) {
         let publisherTokens: Array<string> = pub.trim().toLowerCase().split(' ');
         let publisherName: string = '';
         publisherTokens.forEach((item, index) => {
            if (item.length) {
               publisherName = `${publisherName}${item[0].toUpperCase()}${item.substr(1)}`;
               if (index !== publisherTokens.length - 1) {
                  publisherName += ' ';
               }
            }
         });
         publisherName.trim();
         return publisherName;
      }
      return 'Unknown';
   }

   //getting data function
   public loadXML(xmlFilePath: string): Observable<Biblio> {
      return new Observable<Biblio>(observer => {
         //Read Data
         this.http.get(xmlFilePath,
            {
               headers: new HttpHeaders()
                  .set('Content-Type', 'text/xml')
                  .append('Access-Control-Allow-Methods', 'GET')
                  .append('Access-Control-Allow-Origin', '*')
                  .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
               responseType: 'text'
            }).subscribe((data) => {
               this.parseXML(data).subscribe((data) => {
                  let xmlLib: Library = data;
                  let xmlAuthors: Array<Author> = this.extractAuthors(xmlLib);

                  let xmlPublishers: Array<Publisher> = this.extractPublishers(xmlLib);
                  if (xmlLib.by === ViewBy.BY_SERIES) {
                     this.updateAuthorsAndPublishers(xmlLib, xmlAuthors, xmlPublishers);
                  }
                  let biblio: Biblio = {
                     authors: xmlAuthors,
                     publishers: xmlPublishers,
                     library: xmlLib
                  };
                  // this.dataService.allBiblio.push(biblio);
                  // console.log('BIBLIO: ', biblio);
                  observer.next(biblio);
               });
            });
      });
   }

   //store xml data into array variable
   private parseXML(data: any): Observable<Library> {
      const parseCategories = (libId: string, by: ViewBy, categoryList: Array<any>): Array<Category> => {
         // console.log('parse categories: ', categoryList);
         const categories: Array<Category> = [];
         categoryList.forEach(item => {
            let catId: string = uuidv4();
            let cat: Category = {
               id: catId,
               parentId: libId,
               name: item.$.name,
               prefix: item.$.prefix,
               bg: item.$.bg,
               resume: item.RESUME,
               by: by
            };
            if (cat.by === ViewBy.BY_SERIES) {
               cat.series = parseSeries(catId, undefined, by, item.SERIE);
            } else {
               cat.authors = parseAuthors(catId, by, item.AUTHOR);
            }
            categories.push(cat);
         })
         return categories;
      }

      const parseSeries = (parentId: string, authId: string | undefined, by: ViewBy, seriesList: Array<any>): Array<Series> => {
         // console.log('parse series: ', seriesList);
         const series: Array<Series> = [];
         if (seriesList) {
            if (Array.isArray(seriesList)) {
               seriesList.forEach(item => {
                  let serId: string = uuidv4();
                  let ser: Series = {
                     id: serId,
                     by: by,
                     parentId: parentId,
                     name: item.$.name,
                     authorIds: [item.$.author],
                     status: item.$.status,
                     resume: item.RESUME,
                     books: parseBooks(serId, by === ViewBy.BY_AUTHOR ? authId : undefined, by, item.BOOK)
                  }
                  series.push(ser);
               });
            } else {
               let item = seriesList as any;
               let serId: string = uuidv4();
               let ser: Series = {
                  id: serId,
                  by: by,
                  parentId: parentId,
                  name: item.$.name,
                  authorIds: [item.$.author],
                  status: item.$.status,
                  resume: item.RESUME,
                  books: parseBooks(serId, by === ViewBy.BY_AUTHOR ? authId : undefined, by, item.BOOK)
               }
               series.push(ser);
            }
         }
         return series;
      }

      const parseAuthors = (catId: string, by: ViewBy, authorList: Array<any>): Array<Author> => {
         //console.log('parse authors: ', authorList);
         const authors: Array<Author> = [];
         authorList.forEach(item => {
            //console.log('author: ', item);
            let autId: string = uuidv4();
            let firstName: string = '';
            let lastName: string = '';
            let parseName = XmlParserService.extractAuthor(item.$.name);
            if (parseName) {
               firstName = parseName.firstName;
               lastName = parseName.lastName;
            }
            let aut: Author = {
               id: autId,
               parentId: catId,
               by: by,
               firstName: firstName,
               lastName: lastName,
               resume: item.RESUME,
               books: item.BOOK ? parseBooks(undefined, autId, by, item.BOOK) : [],
               series: item.SERIE ? parseSeries(autId, autId, by, item.SERIE) : []
            }
            authors.push(aut);
         });
         return authors;
      }


      const parseBooks = (serId: string | undefined, autId: string | undefined, by: ViewBy, bookList: Array<any>): Array<Book> => {
         const books: Array<Book> = [];
         if (bookList) {
            if (Array.isArray(bookList)) {
               bookList.forEach(item => {
                  let bok: Book = {
                     id: uuidv4(),
                     parentId: serId ? serId : autId,
                     by: by,
                     name: item.$.name,
                     authorIds: by === ViewBy.BY_AUTHOR ? [autId] : [item.$.author],
                     status: item.$.status,
                     resume: item.RESUME,
                     isbn10: item.$.isbn10,
                     isbn13: item.$.isbn13,
                     cover: item.$.cover,
                     date: item.$.date,
                     format: item.$.format,
                     page: item.$.page,
                     publisherId: item.$.publisher,
                     ref: item.$.stamp,
                     tome: item.$.tome,
                     year: item.$.year,
                     biblice: {
                        codeBarre: item.$.codeBarre,
                        codeAccess: item.$.codeAccess
                     }
                  }
                  books.push(bok);
               });
            } else {
               let item = bookList as any;
               let bok: Book = {
                  id: uuidv4(),
                  parentId: serId ? serId : autId,
                  by: by,
                  name: item.$.name,
                  authorIds: by === ViewBy.BY_AUTHOR ? [autId] : [item.$.author],
                  status: item.$.status,
                  resume: item.RESUME,
                  isbn10: item.$.isbn10,
                  isbn13: item.$.isbn13,
                  cover: item.$.cover,
                  date: item.$.date,
                  format: item.$.format,
                  page: item.$.page,
                  publisherId: item.$.publisher,
                  ref: item.$.stamp,
                  tome: item.$.tome,
                  year: item.$.year,
                  biblice: {
                     codeBarre: item.$.codeBarre,
                     codeAccess: item.$.codeAccess
                  }
               }
               books.push(bok);
            }
         }
         return books;
      }

      return new Observable(observer => {
         let k: string | number;
         let parser = new xml2js.Parser({ trim: true, explicitArray: false });
         parser.parseString(data, function (err: any, result: any) {
            //console.log('parse XML result: ', result);
            let libId: string = uuidv4();
            let lib: Library = {
               id: libId,
               name: result.LIB.$.name,
               prefix: result.LIB.$.prefix,
               path: result.LIB.$.path,
               by: result.LIB.$.mode,
               resume: result.LIB.RESUME,
               categories: parseCategories(libId, result.LIB.$.mode, result.LIB.CATEGORY)
            }
            observer.next(lib);
         });
      });
   }

   private extractAuthors(lib: Library): Array<Author> {
      let authors: Array<Author> = [];
      lib.categories?.forEach(cat => {
         if (cat.by === ViewBy.BY_SERIES) {
            cat.series?.forEach(ser => {
               ser.authorIds.forEach(aut => {
                  if (aut !== '') {
                     let author: Author | undefined = XmlParserService.extractAuthor(aut);
                     if (author && !authors.find(item =>
                        (item.firstName === author?.firstName && item.lastName === author.lastName) ||
                        (item.firstName === author?.lastName && item.lastName === author.firstName))) {
                        author.id = uuidv4();
                        authors.push(author);
                     }
                  }
               });
               ser.books?.forEach(bok => {
                  bok.authorIds.forEach(aut => {
                     if (aut !== '') {
                        let author: Author | undefined = XmlParserService.extractAuthor(aut);
                        if (author && !authors.find(item =>
                           (item.firstName === author?.firstName && item.lastName === author.lastName) ||
                           (item.firstName === author?.lastName && item.lastName === author.firstName))) {
                           author.id = uuidv4();
                           authors.push(author);
                        }
                     }
                  });
               });
            });
         } else {
            cat.authors?.forEach(aut => {
               let authorFinder: Author | undefined = authors.find(item =>
                  (item.firstName === aut.firstName && item.lastName === aut.lastName) ||
                  (item.firstName === aut.lastName && item.lastName === aut.firstName));
               if (!authorFinder) {
                  // new author
                  authorFinder = {
                     id: uuidv4(),
                     firstName: aut.firstName,
                     lastName: aut.lastName
                  }
                  authors.push(authorFinder);
               }
               // update author id
               aut.id = authorFinder.id;
               aut.books?.forEach(book => {
                  book.authorIds = [aut.id];
                  book.parentId = aut.id;
               })
               aut.series?.forEach(series => {
                  series.authorIds = [aut.id];
                  series.books?.forEach(book => {
                     book.authorIds = [aut.id];
                  })
               })
            })
         }
      });
      // console.log('authors: ', authors.sort((one, two) => (one.lastName > two.lastName ? 1 : -1)));
      return authors.sort((one, two) => (one.lastName > two.lastName ? 1 : -1));
   }

   private extractPublishers(lib: Library): Array<Publisher> {
      let publishers: Array<Publisher> = [];
      lib.categories?.forEach(cat => {
         if (cat.by === ViewBy.BY_SERIES) {
            cat.series?.forEach(ser => {
               ser.books?.forEach(bok => {
                  if (bok.publisherId != '') {
                     let publisherName: string = XmlParserService.extractPublisher(bok.publisherId);
                     if (!publishers.find(item => item.name === publisherName)) {
                        publishers.push({ id: uuidv4(), name: publisherName });
                     }
                  }
               });
            });
         } else {
            cat.authors?.forEach(aut => {
               aut.books?.forEach(bok => {
                  if (bok.publisherId != '') {
                     let publisherName: string = XmlParserService.extractPublisher(bok.publisherId);
                     let publisherFinder = publishers.find(item => item.name === publisherName);
                     if (!publisherFinder) {
                        publisherFinder = { id: uuidv4(), name: publisherName };
                        publishers.push(publisherFinder);
                     }
                     bok.publisherId = publisherFinder.id;
                  }
               })
               if (aut.series) {
                  aut.series?.forEach(ser => {
                     ser.books?.forEach(bok => {
                        if (bok.publisherId != '') {
                           let publisherName: string = XmlParserService.extractPublisher(bok.publisherId);
                           let publisherFinder = publishers.find(item => item.name === publisherName);
                           if (!publisherFinder) {
                              publisherFinder = { id: uuidv4(), name: publisherName };
                              publishers.push(publisherFinder);
                           }
                           bok.publisherId = publisherFinder.id;
                        }
                     });
                  });
               }
            })
         }
      });
      return publishers.sort((one, two) => (one.name > two.name ? 1 : -1));
   }

   private updateAuthorsAndPublishers(
      xmlLib: Library,
      xmlAuthors: Array<Author>,
      xmlPublishers: Array<Publisher>) {
      const getAuthorId = (author: Author | undefined): string | undefined => {
         if (author) {
            return xmlAuthors.find(item => (item.firstName === author.firstName && item.lastName === author.lastName) || (item.firstName === author.lastName && item.lastName === author.firstName))?.id;
         }
         return undefined;
      }

      const getPublisherId = (publisher: string | undefined): string | undefined => {
         if (publisher) {
            return xmlPublishers.find(item => item.name === publisher)?.id;
         }
         return undefined;
      }

      xmlLib.categories?.forEach(xmlCat => {
         xmlCat.series?.forEach(xmlSerie => {
            xmlSerie.authorIds = [getAuthorId(XmlParserService.extractAuthor(xmlSerie.authorIds[0]))];
            xmlSerie.books?.forEach(xmlBook => {
               xmlBook.authorIds = [getAuthorId(XmlParserService.extractAuthor(xmlBook.authorIds[0]))];
               xmlBook.publisherId = getPublisherId(XmlParserService.extractPublisher(xmlBook.publisherId));
            });
         });
      });
   }
}
