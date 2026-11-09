import {Component, Inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import {SearchBookResult} from 'src/app/models/author.model';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatCheckbox } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-search-modal',
    templateUrl: './search-modal.component.html',
    styleUrls: ['./search-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDialogTitle, MatIcon, CdkScrollable, MatDialogContent, MatCheckbox, ReactiveFormsModule, FormsModule, MatDialogActions, MatButton]
})
export class SearchModalComponent implements OnInit {

  public searchResults: Array<SearchBookResult>;
  public by: string;
  constructor(
    public dialogRef: MatDialogRef<SearchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {by: string; searchResults: Array<SearchBookResult>;}
  ) {
    this.by = data.by;
    this.searchResults = data.searchResults;
  }

  ngOnInit(): void {
  }

  select(index: number) {
    // unselect all others
    let i: number = 0;
    this.searchResults.forEach(item => {
      if (i !== index) {
        item.checked = false;
      }
    });
  }

  cancel(): void{
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close(this.searchResults.find(item => item.checked));
  }
}
