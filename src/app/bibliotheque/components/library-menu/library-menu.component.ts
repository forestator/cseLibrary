import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {NavigationService} from '../../../services/navigation.service';
import {LibraryRepository} from '../../services/library.repository';

@Component({
  selector: 'app-library-menu',
  templateUrl: './library-menu.component.html',
  styleUrl: './library-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class LibraryMenuComponent {
  private readonly libraries = inject(LibraryRepository).libraries;
  private readonly url = toSignal(inject(NavigationService).url$, {initialValue: ''});

  /** Categories of the library currently shown in the URL. */
  protected readonly entries = computed(() => {
    const url = this.url();
    return (this.libraries() ?? [])
      .filter(biblio => biblio.library?.id && url.includes(biblio.library.id))
      .flatMap(biblio =>
        (biblio.library.categories ?? []).map(category => ({
          id: category.id,
          name: category.name,
          route: `bibliotheque/${biblio.library.id}/${category.id}`,
        }))
      );
  });
}
