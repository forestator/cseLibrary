import {Comissions, Game} from "../../models/common.model";
import {Book} from "../../models/author.model";
import {Tool} from "../../bricolage/models/bricolage.model";

export enum BorrowStatus {
  EMPRUNTE = 'EMPRUNTE',
  RESERVED = 'RESERVED',
  RETURNED = 'RETURNED',
  LATE = 'LATE'
}

export interface Borrow {
  item: Game | Book | Tool;
  startDate: string;
  endDate: string;
  status: BorrowStatus;
  comission: Comissions;
}

export interface BorrowForUser {
  [userId: string]: Borrow[];
}
