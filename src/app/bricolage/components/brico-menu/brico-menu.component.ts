import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';
import {Tool} from '../../models/bricolage.model';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {NavigationService} from '../../../services/navigation.service';

@Component({
    selector: 'app-brico-menu',
    templateUrl: './brico-menu.component.html',
    styleUrls: ['./brico-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BricoMenuComponent {
  @Input() allTools: Array<Tool>;

  searchText: FormControl<string> = new FormControl<string>(null);
  filteredOptions$?: Observable<Array<Tool>>;
  constructor(private navService: NavigationService) {
    this.allTools = [];
    this.filteredOptions$ = this.searchText.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string | Tool): Array<Tool> {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
    return this.allTools?.filter((item) =>
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
