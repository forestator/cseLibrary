export interface Biblio {
    authors?: Array<Author>;
    publishers?: Array<Publisher>;
    library?: Library;
}
export interface BookPath {
    category: Category;
    series: Series;
    book: Book;
}
export interface Author {
    id?: string;
    firstName: string;
    lastName: string;
    nationality?: string;
    resume?: string;

    by?: ViewBy;
    parentId?: string;
    series?: Array<Series>;
    books?: Array<Book>;
}

export interface Publisher {
    id?: string;
    by?: ViewBy;
    parentId?: string;
    name: string;
    url?: string;
}
export enum ViewBy {
    BY_SERIES = 'BY_SERIES',
    BY_AUTHOR = 'BY_AUTHOR'
}
export interface Library {
    id?: string;
    name: string;
    by: ViewBy;
    prefix: string;
    path?: string;
    resume: string;
    categories?: Array<Category>;
}

export interface Category {
    id?: string;
    parentId?: string;
    name: string;
    prefix: string;
    resume: string;
    by: ViewBy | undefined;
    bg?: string;
    series?: Array<Series>;
    authors?: Array<Author>;
}
export enum SeriesStatus {
    ONE_SHOT = 'ONE_SHOT',
    NEW = 'NEW',
    IN_PROGRESS = 'IN_PROGRESS',
    INCOMPLETE = 'INCOMPLETE',
    FINISHED = 'FINISHED',
    DECLASSED = 'DECLASSED',
}
export interface Series {
    id?: string;
    parentId?: string;
    name: string;
    by: ViewBy | undefined;
    authorIds: Array<string | undefined>;
    status: SeriesStatus;
    resume: string;
    books?: Array<Book>;
}
export enum ViewMode {
    NEW = 'NEW',
    BY_AUTHOR = 'BY_AUTHOR',
    BY_LIBRARY = "BY_LIBRARY",
    BY_CATEGORY = "BY_CATEGORY",
    BY_SERIES = "BY_SERIES",
    BY_BOOK = "BY_BOOK",
    ADMIN = "ADMIN",
    ADMIN_AUTHORS = "ADMIN_AUTHORS",
    ADMIN_PUBLISHERS = "ADMIN_PUBLISHERS"
}
export interface SelectorView {
    mode: ViewMode;
    id: string | undefined;
}
export enum BookStatus {
    NEW = 'NEW',
    AVAILABLE = 'AVAILABLE',
    DECLASSED = 'DECLASSED',
    MISSING = 'MISSING',
    IN_PROJECT = 'IN_PROJECT',
    SEPARATOR = 'SEPARATOR'
}
export interface Book {
    id?: string;
    parentId?: string;
    by: ViewBy | undefined;
    name: string;
    status: BookStatus;
    resume: string;
    authorIds: Array<string | undefined>;
    isbn10: string;
    isbn13: string;
    cover: string;
    format: string;
    page: string;
    publisherId: string | undefined;
    ref: string;
    tome: string;
    date: string;
    year: string;
    biblice?: {
        codeBarre: string;
        codeAccess: string;
     }
}

export interface SearchBookResult {
    checked: boolean,
    title: string;
    resume: string;
    authors: Array<string>;
    isbn10: string;
    isbn13: string;
    format: string;
    page: string;
    publisher: string;
    tome: string;
    publishedDate: string;
}

export enum Libraries {
  IMAGINAIRE = 'litterature-imaginaire',
  INCLASSABLE = 'inclassable',
  LIBRAIRIE_JEUNESSE = 'litterature-jeunesse',
  LITTERATURE_ADULTE = 'litterature-adulte'
}
