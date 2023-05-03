import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {SonoItem} from "../../../../sonotheque/models/sono.model";

@Component({
  selector: 'app-sono-table',
  templateUrl: './sono-table.component.html',
  styleUrls: ['./sono-table.component.scss']
})
export class SonoTableComponent implements  OnInit, OnChanges {
  @Input() sonoItems: Array<SonoItem>;
  displayedColumns = ['id', 'name', 'status'];
  dataSource?: MatTableDataSource<SonoItem>;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    if (this.sonoItems) {
      this.setDatasource(this.sonoItems);
    }
  }

  private setDatasource(sonoItems: Array<SonoItem>) {
    this.dataSource = new MatTableDataSource<SonoItem>(sonoItems);
    // todo make sort works
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.sonoItems) this.setDatasource(this.sonoItems);
  }
}
