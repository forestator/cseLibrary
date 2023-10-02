import {Component, Input} from '@angular/core';
import {Comissions, Game} from '../../../../models/common.model';
import {Tool} from '../../../../bricolage/models/bricolage.model';
import {SonoItem} from '../../../../sonotheque/models/sono.model';
import {NautismeItem} from '../../../../nautisme/models/nautisme.model';
import {CseUser} from '../../../../models/users.model';
import {GamesUtils} from '../../../../models/gamesUtils';
import {MatTableDataSource} from '@angular/material/table';
import {BorrowByComission} from '../../../models/borrow.model';

@Component({
  selector: 'app-planning-emprunts',
  templateUrl: './planning-emprunts.component.html',
  styleUrls: ['./planning-emprunts.component.scss']
})
export class PlanningEmpruntsComponent {

  @Input({required: true}) comission: Comissions;
  @Input({required: true}) users: CseUser[];
  @Input({required: true}) borrowInformations: BorrowByComission[];
  @Input() object: Game | Tool | SonoItem | NautismeItem;
  displayedColumns: string[] = ['name'];
  dataSource = new MatTableDataSource();

  constructor() {
  }

  ngOnInit() {
    switch (this.comission) {
      case Comissions.LUDOTHEQUE:
        const nextComission = GamesUtils.getNextLudothequeOpening();
        this.displayedColumns.push(nextComission.format('DD/MM/YYYY'));
        for (let i = 0; i < 21; i++) {
          const newDate = nextComission.add(2, 'weeks');
          this.displayedColumns.push(newDate.format('DD/MM/YYYY'));
        }
        break;
      default:
        this.displayedColumns = [];
    }

    console.log(this.borrowInformations);
    this.dataSource = new MatTableDataSource(this.borrowInformations);
  }

  ngOnChanges() {
    console.log(this.borrowInformations);
    this.dataSource = new MatTableDataSource(this.borrowInformations);
  }

  isReserved(calendarDate: string) {
    // todo for ludo make it work for jeudi
    return this.borrowInformations.find(borrow => borrow.startDate === calendarDate);
  }
}
