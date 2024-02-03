import {Comissions, Game} from "../../models/common.model";
import {Book} from "../../models/author.model";
import {Tool} from "../../bricolage/models/bricolage.model";
import {SonoItem} from '../../sonotheque/models/sono.model';
import {NautismeItem} from '../../nautisme/models/nautisme.model';

export enum BorrowStatus {
  AVAILABLE = 'AVAILABLE',
  EMPRUNTE = 'EMPRUNTE',
  RESERVED = 'RESERVED',
  RETURNED = 'RETURNED',
  LATE = 'LATE'
}

export interface Borrow {
  item: Game | Book | Tool | SonoItem | NautismeItem;
  startDate: string;
  endDate: string;
  status: BorrowStatus;
  comission: Comissions;
}

export interface BorrowForUser {
  [userId: string]: Borrow[];
}

export interface BorrowByComission extends  Borrow {
  userId: string;
}
