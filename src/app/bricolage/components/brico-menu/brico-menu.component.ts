import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';
import {Tool} from '../../models/bricolage.model';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatAutocomplete, MatOption } from '@angular/material/autocomplete';
import {NavigationService} from '../../../services/navigation.service';
import { MatFormField, MatInput } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-brico-menu',
    templateUrl: './brico-menu.component.html',
    styleUrls: ['./brico-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatFormField, MatInput, ReactiveFormsModule, MatAutocompleteTrigger, MatAutocomplete, MatOption, AsyncPipe]
})
export class BricoMenuComponent {
  private navService = inject(NavigationService);

  readonly allTools = input<Array<Tool>>([]);

  searchText: FormControl<string> = new FormControl<string>(null);
  filteredOptions$?: Observable<Array<Tool>>;
  constructor() {
    this.filteredOptions$ = this.searchText.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string | Tool): Array<Tool> {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
    return this.allTools()?.filter((item) =>
      item.name?.toLowerCase().includes(filterValue)
    );
  }
  goToSelectedItem(matAutocompleteSelectedEvent: MatAutocompleteSelectedEvent) {
    this.navService.goToTool(matAutocompleteSelectedEvent.option.value);
  }

  displayTool(tool?: Tool): string {
    return tool ? `${tool.name}` : '';
  }
}
