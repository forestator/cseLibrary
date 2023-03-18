import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Author, Category, Library, Series, SeriesStatus, ViewBy} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import {BasicModal} from '../basic-modal';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-series-modal',
  templateUrl: './series-modal.component.html',
  styleUrls: ['./series-modal.component.scss']
})
export class SeriesModalComponent extends BasicModal implements OnInit {

  public allStatus: Array<string> = Object.keys(SeriesStatus);

  public title = new UntypedFormControl();
  public resume = new UntypedFormControl();
  public author = new UntypedFormControl();
  public status = new UntypedFormControl();

  constructor(
    public dialogRef: MatDialogRef<SeriesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { parent: Category | Author, series: Series, library: Library },
    public dataService: DataService) {
    super();
    if (data.series) {
      this.isNew = false;
      this.id = data.series.id;
      this.parentId = data.series.parentId;
      this.by = data.series.by;
      this.title.setValue(data.series.name);
      this.resume.setValue(data.series.resume);
      if (data.series.authorIds?.length > 0) {
        this.author.setValue(this.dataService.getCurrentBiblio(this.data.library.id)?.authors?.find(item => item.id === data.series.authorIds[0]));
      }
      this.status.setValue(data.series.status);
    } else {
      this.isNew = true;
      this.id = uuidv4();
      this.parentId = data.parent.id;
      this.by = data.parent.by;
      this.title.setValue('');
      this.resume.setValue('');
      let author: Author | undefined = undefined;
      if (data.parent.by === ViewBy.BY_AUTHOR) {
        author = this.dataService.getCurrentBiblio(this.data.library.id)?.authors?.find(item => item.id === data.parent.id)
      }
      this.author.setValue(author);
      this.status.setValue(SeriesStatus.NEW);
    }
  }

  protected formToData(): Series {
    return {
      id: this.id,
      parentId: this.parentId,
      by: this.by,
      name: this.title.value,
      authorIds: [this.author.value?.id],
      status: this.status.value,
      resume: this.resume.value
    };
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close(this.formToData());
  }

}
