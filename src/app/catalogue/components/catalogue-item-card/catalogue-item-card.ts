import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {BadgeComponent} from '../../../common/components/book-badge/badge.component';
import {ToolsService} from '../../../services/biblio/tools.service';
import {CatalogueItem} from '../../models/catalogue-item.model';
import {CommissionConfig} from '../../models/commission-config.model';

@Component({
  selector: 'app-catalogue-item-row',
  templateUrl: './catalogue-item-row.html',
  styleUrl: './catalogue-item-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent],
})
export class CatalogueItemRow {
  private readonly toolsService = inject(ToolsService);

  readonly item = input.required<CatalogueItem>();
  readonly config = input.required<CommissionConfig>();
  readonly index = input.required<number>();

  private readonly mobile = toSignal(this.toolsService.mobilePhoneDisplay$, {initialValue: false});

  protected readonly imageOnRight = computed(() => this.index() % 2 !== 0 && !this.mobile());
  protected readonly imageSrc = computed(() => this.item().cover ?? this.config().defaultImage);
  protected readonly details = computed(() => {
    const dimensions = this.item().dimensions;
    return this.config().detailFields
      .filter(field => dimensions?.[field.key])
      .map(field => ({label: field.label, value: dimensions[field.key]}));
  });
}
