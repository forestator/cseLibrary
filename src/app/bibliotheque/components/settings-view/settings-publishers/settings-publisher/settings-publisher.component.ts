import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DeleteModalComponent} from 'src/app/bibliotheque/components/modals/delete-modal/delete-modal.component';
import {
  PublisherModalComponent
} from 'src/app/bibliotheque/components/modals/publisher-modal/publisher-modal.component';
import {Publisher} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/data.service';
import {ToolsService} from 'src/app/services/tools.service';

@Component({
   selector: 'app-settings-publisher',
   templateUrl: './settings-publisher.component.html',
   styleUrls: ['./settings-publisher.component.scss']
})
export class SettingsPublisherComponent implements OnInit {
   @Input()
   publisher!: Publisher;

   @Input()
   index!: string;

   @Output() sendDelete = new EventEmitter<string>();


   constructor(
      public tools: ToolsService,
      public dialog: MatDialog,
      public dataService: DataService
   ) { }

   ngOnInit(): void {
   }

   public edit($event: any) {
      $event.stopPropagation();
      const dialogRef = this.dialog.open(
         PublisherModalComponent, {
         height: 'auto',
         width: '1200px',
         data: { publisher: this.publisher }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result) {
            // update book
            this.publisher.name = result.name;
            this.dataService.log();
         }
      });
   }
   public delete($event: any) {
      $event.stopPropagation();
      const dialogRef = this.dialog.open(
         DeleteModalComponent, {
         height: 'auto',
         width: '600px',
         data: { id: this.publisher.id, message: `Voulez vous vraiment supprimer cet editeur: ${this.publisher.name}` }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result) {
            this.sendDelete.emit(this.publisher.id);
         }
      });
   }
}
