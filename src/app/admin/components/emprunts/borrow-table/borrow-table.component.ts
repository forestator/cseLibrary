import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Borrow} from "../../../models/borrow.model";

@Component({
  selector: 'app-borrow-table',
  templateUrl: './borrow-table.component.html',
  styleUrls: ['./borrow-table.component.scss']
})
export class BorrowTableComponent {

  @Input() dataTableSource: MatTableDataSource<Borrow & { selected: boolean }>;
  @Input() selectAllBorrow: boolean;
  @Input() showReturned: boolean;
  @Input() displayedColumns: string[];

  @Output() selectAllBorrowChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectAll(selectAll: boolean) {
    this.selectAllBorrow = selectAll;
    const newData =
      this.dataTableSource?.data.map(data => Object.assign(data, {selected: selectAll}));
    this.dataTableSource = new MatTableDataSource<Borrow & { selected: boolean }>(newData);
    this.selectAllBorrowChange.next(selectAll);
  }
}
