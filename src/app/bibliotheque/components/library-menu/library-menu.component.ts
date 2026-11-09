import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {Biblio} from 'src/app/models/author.model';
import {ToolsService} from 'src/app/services/biblio/tools.service';
import {Observable} from 'rxjs';
import {NavigationService} from '../../../services/navigation.service';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-library-menu',
    templateUrl: './library-menu.component.html',
    styleUrls: ['./library-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink, AsyncPipe]
})
export class LibraryMenuComponent {
  firebaseDatabaseService = inject(FirebaseDatabaseService);
  navService = inject(NavigationService);
  tools = inject(ToolsService);


  title: string = 'Cse';
  prefixRoute: string = 'bibliotheque/';
  menu$: Observable<Array<Biblio> | null> = this.firebaseDatabaseService.bibliothequeOneShot$;
}
