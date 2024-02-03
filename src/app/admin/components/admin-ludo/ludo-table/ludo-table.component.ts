import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {CseUser} from '../../../../models/users.model';
import {MatDialog} from '@angular/material/dialog';
import {Game} from '../../../../models/common.model';
import {BorrowByComission} from '../../../models/borrow.model';
import {FilterBorrowByIDPipe} from '../../../../ludotheque/pipes/filter-borrow-by-id.pipe';
import {BoardGame} from '../../../../models/boardGame.model';
import {ComputeStatisticsPipe} from '../../../pipe/compute-statistics.pipe';

@Component({
    selector: 'app-ludo-table',
    templateUrl: './ludo-table.component.html',
    styleUrls: ['./ludo-table.component.scss']
})
export class LudoTableComponent implements OnInit, OnChanges {
    @Input() games?: Array<Game> | null;
    @Input() displayedColumns!: Array<string>;
    @Input() users?: Array<CseUser>;
    @Input() returnForUser?: CseUser;
    @Input() filterBy?: string;
    @Input() borrowsInformations?: BorrowByComission[];
    dataSource?: MatTableDataSource<Game>;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(public dialog: MatDialog) {
    }

    ngOnInit() {
        if (this.games) {
            this.setDatasource(this.games);
        }
    }

    private setDatasource(games: Array<Game>) {
        if (this.filterBy) {
            this.dataSource = new MatTableDataSource<Game>(games.filter(game =>
                game.name.toLowerCase().includes(this.filterBy?.toLowerCase() ?? '')));
        } else {
            this.dataSource = new MatTableDataSource<Game>(games);
        }
        this.dataSource.sort = this.sort;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.games) this.setDatasource(this.games);
    }


    // function used and called migclly by table
    sortData(sort: Sort) {
        let data = this.games.slice();
        if (!sort.active || sort.direction === '') {
            this.setDatasource(data);
            return;
        }

        data = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            const itemPipe = new FilterBorrowByIDPipe();
            const statPipe = new ComputeStatisticsPipe();
            const itemBorrowsA = itemPipe.transform(this.borrowsInformations, a);
            const itemBorrowsB = itemPipe.transform(this.borrowsInformations, b);

            switch (sort.active) {
                case 'status':
                    return this.compare(itemBorrowsA[itemBorrowsA.length - 1]?.status, itemBorrowsB[itemBorrowsB.length - 1]?.status, isAsc);
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
                case 'stats':
                    const aStat = statPipe.transform(itemBorrowsA);
                    const bStat = statPipe.transform(itemBorrowsB);
                    return this.compare(aStat.substring(0, aStat.length - 1), bStat.substring(0, bStat.length - 1), isAsc);
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
