export class BorrowStatus {
  ref: string;
  name: string;
  date: Date;
  libraryId: string;
}

export interface BddBorrowStatus {
  [ref: string]: BorrowStatus;
}

export interface CseUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  borrowedGames?: BddBorrowStatus;
}

export interface BddUsers {
  [id: string]: CseUser;
}
