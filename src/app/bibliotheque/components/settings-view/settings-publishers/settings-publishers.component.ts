import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Publisher} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/data.service';

@Component({
   selector: 'app-settings-publishers',
   templateUrl: './settings-publishers.component.html',
   styleUrls: ['./settings-publishers.component.scss']
})
export class SettingsPublishersComponent implements OnInit {

   @Input()
   publishers!: Array<Publisher> | undefined;

   @Input()
   index!: number;

   @Output() sendDelete = new EventEmitter<string>();

   constructor(public dataService: DataService) { }

   ngOnInit(): void {
   }

   public deletePublisher($event: string): void {
      console.log('Delete publisher: ', $event);
      let index = this.publishers?.findIndex(d => d.id === $event); //find index in your array
      if (index !== undefined) {
         this.publishers?.splice(index, 1);//remove element from array
      }
      this.dataService.log();
   }
}
