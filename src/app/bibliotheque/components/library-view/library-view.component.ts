import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {ToolsService} from '../../../services/biblio/tools.service';
import {CategoryBackgroundPipe} from '../../pipes/category-background.pipe';
import {LibraryRepository} from '../../services/library.repository';

@Component({
  selector: 'app-library-view',
  templateUrl: './library-view.component.html',
  styleUrl: './library-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CategoryBackgroundPipe],
})
export class LibraryViewComponent {
  private readonly repository = inject(LibraryRepository);

  readonly libraryId = input<string>();

  protected readonly isMobile = toSignal(inject(ToolsService).mobilePhoneDisplay$, {initialValue: false});
  protected readonly library = computed(() => this.repository.libraryById(this.libraryId())?.library);
}
