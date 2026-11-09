import {Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy, input, viewChild} from '@angular/core';
import {Tool} from '../../../../bricolage/models/bricolage.model';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { BadgeComponent } from '../../../../common/components/book-badge/badge.component';

@Component({
    selector: 'app-brico-table',
    templateUrl: './brico-table.component.html',
    styleUrls: ['./brico-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, BadgeComponent, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class BricoTableComponent implements OnInit, OnChanges {
  readonly tools = input<Array<Tool>>(undefined);
  displayedColumns = ['id','cover',  'name', 'status'];
  dataSource?: MatTableDataSource<Tool>;
  readonly sort = viewChild.required(MatSort);

  ngOnInit() {
    const tools = this.tools();
    if (tools) {
      this.setDatasource(tools);
    }
  }

  private setDatasource(tools: Array<Tool>) {
    this.dataSource = new MatTableDataSource<Tool>(tools);
    // todo make sort works
    this.dataSource.sort = this.sort();
  }

  ngOnChanges(changes: SimpleChanges) {
    const tools = this.tools();
    if (tools) this.setDatasource(tools);
  }
}
