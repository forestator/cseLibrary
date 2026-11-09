import {ChangeDetectionStrategy, Component, computed, input, viewChild} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {BadgeComponent} from '../../../../common/components/book-badge/badge.component';
import {CatalogueItem} from '../../../../catalogue/models/catalogue-item.model';

@Component({
  selector: 'app-catalogue-table',
  templateUrl: './catalogue-table.html',
  styleUrl: './catalogue-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell,
    BadgeComponent, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, NgOptimizedImage],
})
export class CatalogueTable {
  readonly items = input.required<CatalogueItem[]>();

  protected readonly displayedColumns = ['id', 'cover', 'name', 'status'];
  private readonly sort = viewChild(MatSort);

  protected readonly dataSource = computed(() => {
    const dataSource = new MatTableDataSource<CatalogueItem>(this.items());
    dataSource.sort = this.sort() ?? null;
    return dataSource;
  });
}
