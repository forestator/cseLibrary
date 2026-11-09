import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy, inject, input, viewChild } from '@angular/core';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {CseUser} from '../../../../models/users.model';
import {MatDialog} from '@angular/material/dialog';
import {Game} from '../../../../models/common.model';
import {BoardGame} from '../../../../models/boardGame.model';
import { BadgeComponent } from '../../../../common/components/book-badge/badge.component';

@Component({
    selector: 'app-ludo-table',
    templateUrl: './ludo-table.component.html',
    styleUrls: ['./ludo-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, BadgeComponent, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class LudoTableComponent implements OnInit, OnChanges {
    dialog = inject(MatDialog);

    readonly games = input<Array<Game> | null>(undefined);
    readonly displayedColumns = input.required<Array<string>>();
    readonly users = input<Array<CseUser>>(undefined);
    readonly returnForUser = input<CseUser>(undefined);
    readonly filterBy = input<string>(undefined);
    dataSource?: MatTableDataSource<Game>;
    readonly sort = viewChild.required(MatSort);

    ngOnInit() {
        const games = this.games();
        if (games) {
            this.setDatasource(games);
        }
    }

    private setDatasource(games: Array<Game>) {
        if (this.filterBy()) {
            this.dataSource = new MatTableDataSource<Game>(games.filter(game =>
                game.name.toLowerCase().includes(this.filterBy()?.toLowerCase() ?? '')));
        } else {
            this.dataSource = new MatTableDataSource<Game>(games);
        }
        this.dataSource.sort = this.sort();
    }

    ngOnChanges(changes: SimpleChanges) {
        const games = this.games();
        if (games) this.setDatasource(games);
    }


    // function used and called migclly by table
    sortData(sort: Sort) {
        let data = this.games().slice();
        if (!sort.active || sort.direction === '') {
            this.setDatasource(data);
            return;
        }

        data = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'category':
                    return this.compare(a.category, b.category, isAsc);
                case 'name':
                    return this.compare(a.name, b.name, isAsc);
                case 'weight':
                    if ('weight' in a && 'weight' in b) {
                        return this.compare((a as BoardGame).weight, (b as BoardGame).weight, isAsc)
                    }
                    return 0;
                case 'ref':
                    return this.compare(a.ref, b.ref, isAsc);
                default:
                    return 0;
            }
        });

        this.setDatasource(data);
    }

    private compare(a: number | string, b: number | string, isAsc: boolean): number {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
