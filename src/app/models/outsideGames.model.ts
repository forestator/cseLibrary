import {LudoStatus} from './common.model';

export interface OutsideGame {
  name: string;
  ref: string;
  status: LudoStatus;
  cover?: string;
}
