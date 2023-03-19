import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Biblio} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';

@Component({
   selector: 'app-settings-publishers',
   templateUrl: './settings-publishers.component.html',
   styleUrls: ['./settings-publishers.component.scss']
})
export class SettingsPublishersComponent implements OnInit {

   @Input()
   index!: number;

  @Input()
  biblio!: Biblio;

   @Output() sendDelete = new EventEmitter<string>();

   constructor(public dataService: DataService) { }

   ngOnInit(): void {
   }

   public deletePublisher($event: string): void {
      console.log('Delete publisher: ', $event);
      let index = this.biblio?.publishers?.findIndex(d => d.id === $event); //find index in your array
      if (index !== undefined) {
         this.biblio?.publishers?.splice(index, 1);//remove element from array
      }
      this.dataService.log();
   }
}
