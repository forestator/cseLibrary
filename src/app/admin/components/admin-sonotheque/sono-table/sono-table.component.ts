import {Component, OnChanges, OnInit, SimpleChanges, ViewChild, ChangeDetectionStrategy, input} from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from "@angular/material/table";
import { MatSort, MatSortHeader } from "@angular/material/sort";
import {SonoItem} from "../../../../sonotheque/models/sono.model";
import { BadgeComponent } from '../../../../common/components/book-badge/badge.component';

@Component({
    selector: 'app-sono-table',
    templateUrl: './sono-table.component.html',
    styleUrls: ['./sono-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, BadgeComponent, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class SonoTableComponent implements  OnInit, OnChanges {
  readonly sonoItems = input<Array<SonoItem>>(undefined);
  displayedColumns = ['id', 'cover', 'name', 'status'];
  dataSource?: MatTableDataSource<SonoItem>;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    const sonoItems = this.sonoItems();
    if (sonoItems) {
      this.setDatasource(sonoItems);
    }
  }

  private setDatasource(sonoItems: Array<SonoItem>) {
    this.dataSource = new MatTableDataSource<SonoItem>(sonoItems);
    // todo make sort works
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    const sonoItems = this.sonoItems();
    if (sonoItems) this.setDatasource(sonoItems);
  }
}
