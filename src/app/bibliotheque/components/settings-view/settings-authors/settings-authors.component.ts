import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Author, Library} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';

@Component({
   selector: 'app-settings-authors',
   templateUrl: './settings-authors.component.html',
   styleUrls: ['./settings-authors.component.scss']
})
export class SettingsAuthorsComponent implements OnInit {

   @Input()
   authors!: Array<Author> | undefined;

   @Input()
   index!: number;

  @Input()
  library!: Library;

   @Output() sendDelete = new EventEmitter<string>();

   constructor(public dataService: DataService) { }

   ngOnInit(): void {
   }

   public deleteAuthor($event: string): void {
      console.log('Delete auhor: ', $event);
      let index = this.authors?.findIndex(d => d.id === $event); //find index in your array
      if (index !== undefined) {
         this.authors?.splice(index, 1);//remove element from array
      }
      this.dataService.log();
   }
}
