import { Component, OnInit, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import {Biblio} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import { SettingsPublisherComponent } from './settings-publisher/settings-publisher.component';

@Component({
    selector: 'app-settings-publishers',
    templateUrl: './settings-publishers.component.html',
    styleUrls: ['./settings-publishers.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [SettingsPublisherComponent]
})
export class SettingsPublishersComponent implements OnInit {
   dataService = inject(DataService);


   readonly index = input.required<number>();

  readonly biblio = input.required<Biblio>();

   readonly sendDelete = output<string>();

   ngOnInit(): void {
   }

   public deletePublisher($event: string): void {
      console.log('Delete publisher: ', $event);
      const biblio = this.biblio();
      let index = biblio?.publishers?.findIndex(d => d.id === $event); //find index in your array
      if (index !== undefined) {
         biblio?.publishers?.splice(index, 1);//remove element from array
      }
      this.dataService.log();
   }
}
