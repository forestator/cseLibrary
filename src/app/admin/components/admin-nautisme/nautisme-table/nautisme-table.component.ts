import {Component, SimpleChanges, ChangeDetectionStrategy, input, viewChild} from '@angular/core';
import {NautismeItem} from '../../../../nautisme/models/nautisme.model';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { BadgeComponent } from '../../../../common/components/book-badge/badge.component';

@Component({
    selector: 'app-nautisme-table',
    templateUrl: './nautisme-table.component.html',
    styleUrls: ['./nautisme-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, BadgeComponent, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class NautismeTableComponent {

  readonly nautItems = input<NautismeItem[]>(undefined);
  displayedColumns = ['id', 'cover', 'name', 'status'];
  dataSource?: MatTableDataSource<NautismeItem>;
  readonly sort = viewChild.required(MatSort);

  ngOnInit() {
    const nautItems = this.nautItems();
    if (nautItems) {
      this.setDatasource(nautItems);
    }
  }

  private setDatasource(nautismeItems: Array<NautismeItem>) {
    this.dataSource = new MatTableDataSource<NautismeItem>(nautismeItems);
    // todo make sort works
    this.dataSource.sort = this.sort();
  }

  ngOnChanges(changes: SimpleChanges) {
    const nautItems = this.nautItems();
    if (nautItems) this.setDatasource(nautItems);
  }
}
