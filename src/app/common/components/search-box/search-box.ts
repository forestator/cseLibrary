import {NgTemplateOutlet} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, contentChild, input, output, TemplateRef} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteOrigin, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatIcon} from '@angular/material/icon';

export interface SearchOptionContext<T> {
  $implicit: T;
}

/**
 * Top bar search field with an autocomplete panel. The parent owns the matching: it listens to `queryChange`,
 * feeds back `options`, and describes how an option looks with an `<ng-template let-option>` child.
 */
@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.html',
  styleUrl: './search-box.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatAutocompleteTrigger, MatAutocompleteOrigin, MatAutocomplete, MatOption, MatIcon, NgTemplateOutlet],
})
export class SearchBox<T> {
  readonly inputId = input.required<string>();
  readonly label = input.required<string>();
  readonly options = input.required<ReadonlyArray<T>>();
  /** Text put in the field once an option is picked, and used as the query when the field holds an option. */
  readonly displayWith = input.required<(option: T) => string>();
  /** Announces and shows "no result" when something was typed but nothing matches. */
  readonly emptyText = input('Aucun résultat');

  readonly queryChange = output<string>();
  readonly selected = output<T>();

  protected readonly optionTemplate = contentChild.required<TemplateRef<SearchOptionContext<T>>>(TemplateRef);

  protected readonly searchText = new FormControl<string | T>('', {nonNullable: true});
  private readonly value = toSignal(this.searchText.valueChanges, {initialValue: ''});

  protected readonly query = computed(() => {
    const value = this.value();
    return typeof value === 'string' ? value : this.displayWith()(value);
  });
  protected readonly hasText = computed(() => !!this.query());
  protected readonly isEmpty = computed(() => !!this.query().trim() && !this.options().length);
  protected readonly status = computed(() => {
    if (!this.query().trim()) {
      return '';
    }
    const count = this.options().length;
    return count ? `${count} résultat${count > 1 ? 's' : ''} disponible${count > 1 ? 's' : ''}` : this.emptyText();
  });

  protected readonly display = (option?: T | string): string =>
    typeof option === 'string' ? option : option === undefined ? '' : this.displayWith()(option);

  constructor() {
    this.searchText.valueChanges.subscribe(() => this.queryChange.emit(this.query()));
  }

  protected clear(): void {
    this.searchText.setValue('');
  }

  protected select(event: MatAutocompleteSelectedEvent): void {
    this.selected.emit(event.option.value as T);
  }
}
