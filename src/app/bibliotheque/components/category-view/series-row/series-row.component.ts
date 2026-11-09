import { Component, Input, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import {Biblio, Series} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import {ToolsService} from 'src/app/services/biblio/tools.service';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { SeriesBadgeComponent } from '../../common/series-badge/series-badge.component';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { BadgeComponent } from '../../../../common/components/book-badge/badge.component';
import { AsyncPipe } from '@angular/common';
import { BookFilterPipe } from '../../../../pipes/book-filter.pipe';
import { BookCoverPipe } from '../../../pipes/book-cover.pipe';

@Component({
    selector: 'app-series-row',
    templateUrl: './series-row.component.html',
    styleUrls: ['./series-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, SeriesBadgeComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, BadgeComponent, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, AsyncPipe, BookFilterPipe, BookCoverPipe]
})
export class SeriesRowComponent implements OnInit {
  tools = inject(ToolsService);
  dataService = inject(DataService);

  @Input()
  series!: Series | undefined;

  @Input()
  biblio!: Biblio;

  bookColumns: Array<string> = ['cover', 'title', 'authors', 'tome', 'isbn', 'page', 'status'];

  ngOnInit(): void {

  }
}
