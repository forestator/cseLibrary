import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Biblio} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';

@Component({
    selector: 'app-settings-authors',
    templateUrl: './settings-authors.component.html',
    styleUrls: ['./settings-authors.component.scss'],
    standalone: false
})
export class SettingsAuthorsComponent implements OnInit {

   @Input()
   index!: number;

  @Input()
  biblio!: Biblio;

   @Output() sendDelete = new EventEmitter<string>();

   constructor(public dataService: DataService) { }

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
