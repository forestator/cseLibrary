import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef
} from '@angular/material/legacy-dialog';
import {SearchBookResult} from 'src/app/models/author.model';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss']
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
