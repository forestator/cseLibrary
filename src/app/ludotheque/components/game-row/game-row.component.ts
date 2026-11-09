import {NgTemplateOutlet} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {Game} from '../../../models/common.model';
import {ToolsService} from '../../../services/biblio/tools.service';
import {ScrollToSelectedDirective} from '../../directives/scroll-to-selected.directive';

/** Row of a game list: cover on one side, alternating with the index, title, reference and optional details. */
@Component({
  selector: 'app-game-row',
  templateUrl: './game-row.component.html',
  styleUrl: './game-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollToSelectedDirective, NgTemplateOutlet],
})
export class GameRowComponent {
  readonly game = input.required<Game>();
  readonly index = input.required<number>();
  readonly selectedId = input<string>();
  /** Id of the row in the page, defaults to the game reference. */
  readonly anchorId = input<string>();
  readonly infos = input<ReadonlyArray<string>>([]);
  readonly description = input<string>();

  private readonly mobilePhoneDisplay = toSignal(inject(ToolsService).mobilePhoneDisplay$, {requireSync: true});

  protected readonly rowId = computed(() => this.anchorId() ?? this.game().ref);
  protected readonly coverFirst = computed(() => this.index() % 2 === 0 || this.mobilePhoneDisplay());
}
