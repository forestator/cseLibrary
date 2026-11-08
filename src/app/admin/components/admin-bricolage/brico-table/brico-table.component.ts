import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {Tool} from '../../../../bricolage/models/bricolage.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
    selector: 'app-brico-table',
    templateUrl: './brico-table.component.html',
    styleUrls: ['./brico-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BricoTableComponent implements OnInit, OnChanges {
  @Input() tools: Array<Tool>;
  displayedColumns = ['id','cover',  'name', 'status'];
  dataSource?: MatTableDataSource<Tool>;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    if (this.tools) {
      this.setDatasource(this.tools);
    }
  }

  private setDatasource(tools: Array<Tool>) {
    this.dataSource = new MatTableDataSource<Tool>(tools);
    // todo make sort works
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.tools) this.setDatasource(this.tools);
  }
}
