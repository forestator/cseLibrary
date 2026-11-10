import {Author, Biblio, Book, BookStatus, Category, Series} from '../../models/author.model';
import {isBookVisible} from './library-visibility';

/** A book of the catalogue with everything the search needs, normalized once. */
export interface BookSearchEntry {
  key: string;
  book: Book;
  libraryId: string;
  libraryName: string;
  libraryPath?: string;
  category: Category;
  series?: Series;
  /** Set when the book hangs under an author, in a category browsed by author. */
  authorId?: string;
  authors: string;
  title: string;
  seriesName: string;
  authorsText: string;
  isbns: ReadonlyArray<string>;
}

export const DEFAULT_SEARCH_LIMIT = 30;

const SCORE = {
  titleWord: 40, titleAny: 25,
  seriesWord: 30, seriesAny: 20,
  authorWord: 30, authorAny: 20,
  isbnExact: 60, isbnPrefix: 50, isbnAny: 30,
  exactTitle: 50, titlePrefix: 20,
};
const MIN_ISBN_FRAGMENT = 4;

/** Lowercase, accents removed, anything but letters and digits turned into single spaces. */
export function normalizeText(text?: string): string {
  return (text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function normalizeIsbn(isbn?: string): string {
  return (isbn ?? '').toLowerCase().replace(/[^0-9x]/g, '');
}

/** Flattens the libraries into one entry per visible book (every book in admin mode). Separators are never listed. */
export function buildSearchIndex(biblios: ReadonlyArray<Biblio> | undefined, isAdmin: boolean): Array<BookSearchEntry> {
  const entries = new Map<string, BookSearchEntry>();
  for (const biblio of biblios ?? []) {
    const library = biblio.library;
    for (const category of library?.categories ?? []) {
      const add = (book: Book, series?: Series, author?: Author) => {
        if (book.status === BookStatus.SEPARATOR || (!isAdmin && !isBookVisible(book))) {
          return;
        }
        const key = `${library?.id}/${category.id}/${book.id}`;
        if (entries.has(key)) {
          return;
        }
        const authorIds = [...new Set([...(book.authorIds ?? []), author?.id])];
        const authors = authorIds
          .map(authorId => biblio.authors?.find(candidate => candidate.id === authorId))
          .filter((candidate): candidate is Author => !!candidate)
          .map(candidate => `${candidate.firstName} ${candidate.lastName}`.trim())
          .join(', ');
        entries.set(key, {
          key, book, category, series, authors,
          libraryId: library?.id ?? '',
          libraryName: library?.name ?? '',
          libraryPath: library?.path,
          authorId: author?.id,
          title: normalizeText(book.name),
          seriesName: normalizeText(series?.name),
          authorsText: normalizeText(authors),
          isbns: [normalizeIsbn(book.isbn10), normalizeIsbn(book.isbn13)].filter(Boolean),
        });
      };
      // Books of a series come first so a book listed twice opens on its series page.
      for (const series of category.series ?? []) {
        (series.books ?? []).forEach(book => add(book, series));
      }
      for (const author of category.authors ?? []) {
        (author.books ?? []).forEach(book => add(book, undefined, author));
        for (const series of author.series ?? []) {
          (series.books ?? []).forEach(book => add(book, series, author));
        }
      }
    }
  }
  return [...entries.values()];
}

function startsAWord(text: string, fragment: string): boolean {
  return text.startsWith(fragment) || text.includes(` ${fragment}`);
}

function fieldScore(text: string, fragment: string, wordScore: number, anyScore: number): number {
  if (!text) {
    return 0;
  }
  if (startsAWord(text, fragment)) {
    return wordScore;
  }
  return text.includes(fragment) ? anyScore : 0;
}

function isbnScore(isbns: ReadonlyArray<string>, fragment: string): number {
  if (fragment.length < MIN_ISBN_FRAGMENT || !/^[0-9]+x?$/.test(fragment)) {
    return 0;
  }
  return Math.max(0, ...isbns.map(isbn => {
    if (isbn === fragment) {
      return SCORE.isbnExact;
    }
    if (isbn.startsWith(fragment)) {
      return SCORE.isbnPrefix;
    }
    return isbn.includes(fragment) ? SCORE.isbnAny : 0;
  }));
}

/** Score of one word of the query against an entry, 0 when no field contains it. */
function wordScore(entry: BookSearchEntry, word: string): number {
  return Math.max(
    fieldScore(entry.title, word, SCORE.titleWord, SCORE.titleAny),
    fieldScore(entry.seriesName, word, SCORE.seriesWord, SCORE.seriesAny),
    fieldScore(entry.authorsText, word, SCORE.authorWord, SCORE.authorAny),
    isbnScore(entry.isbns, word),
  );
}

/** Words of the query; hyphens inside an ISBN do not split it. */
function queryWords(query: string): Array<string> {
  return normalizeText(query.replace(/(?<=\d)-(?=[\dxX])/g, '')).split(' ').filter(Boolean);
}

/**
 * Entries matching every word of the query (title, series, author or ISBN, ignoring case and accents),
 * best first: ISBN and exact titles, then words starting a field, then plain substrings; ties by title.
 */
export function searchBooks(index: ReadonlyArray<BookSearchEntry>, query: string, limit = DEFAULT_SEARCH_LIMIT): Array<BookSearchEntry> {
  const words = queryWords(query);
  if (!words.length) {
    return [];
  }
  const phrase = words.join(' ');
  return index
    .map(entry => {
      const scores = words.map(word => wordScore(entry, word));
      if (scores.some(score => score === 0)) {
        return {entry, score: 0};
      }
      let score = scores.reduce((total, current) => total + current, 0);
      if (entry.title === phrase) {
        score += SCORE.exactTitle;
      } else if (entry.title.startsWith(phrase)) {
        score += SCORE.titlePrefix;
      }
      return {entry, score};
    })
    .filter(result => result.score > 0)
    .sort((first, second) => second.score - first.score || first.entry.title.localeCompare(second.entry.title, 'fr') || first.entry.book.name.localeCompare(second.entry.book.name))
    .slice(0, limit)
    .map(result => result.entry);
}
