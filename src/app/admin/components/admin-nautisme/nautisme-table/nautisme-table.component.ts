import {Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import {NautismeItem} from '../../../../nautisme/models/nautisme.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-nautisme-table',
  templateUrl: './nautisme-table.component.html',
  styleUrls: ['./nautisme-table.component.scss']
})
export class NautismeTableComponent {

  @Input() nautItems: NautismeItem[];
  displayedColumns = ['id', 'cover', 'name', 'status'];
  dataSource?: MatTableDataSource<NautismeItem>;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    if (this.nautItems) {
      this.setDatasource(this.nautItems);
    }
  }

  private setDatasource(nautismeItems: Array<NautismeItem>) {
    this.dataSource = new MatTableDataSource<NautismeItem>(nautismeItems);
    // todo make sort works
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.nautItems) this.setDatasource(this.nautItems);
  }
}
