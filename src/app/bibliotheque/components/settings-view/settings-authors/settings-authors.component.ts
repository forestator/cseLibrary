import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, inject } from '@angular/core';
import {Biblio} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import { SettingsAuthorComponent } from '../settings-category/settings-author/settings-author.component';

@Component({
    selector: 'app-settings-authors',
    templateUrl: './settings-authors.component.html',
    styleUrls: ['./settings-authors.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [SettingsAuthorComponent]
})
export class SettingsAuthorsComponent implements OnInit {
   dataService = inject(DataService);


   @Input()
   index!: number;

  @Input()
  biblio!: Biblio;

   @Output() sendDelete = new EventEmitter<string>();

   ngOnInit(): void {
   }

   public deleteAuthor($event: string): void {
      console.log('Delete auhor: ', $event);
      let index = this.biblio.authors?.findIndex(d => d.id === $event); //find index in your array
      if (index !== undefined) {
         this.biblio.authors?.splice(index, 1);//remove element from array
      }
      this.dataService.log();
   }
}
