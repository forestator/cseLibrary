import {computed, inject, Injectable} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {catchError, map, of, take} from 'rxjs';
import {Biblio, Libraries} from '../../models/author.model';

// Position of each library in the `bibliotheque` array of the database.
const LIBRARY_ORDER: ReadonlyArray<Libraries> = [
  Libraries.IMAGINAIRE,
  Libraries.INCLASSABLE,
  Libraries.LIBRAIRIE_JEUNESSE,
  Libraries.LITTERATURE_ADULTE,
];

/**
 * Single access point to the library catalogue (library > categories > series > books, authors, publishers).
 * Everything backend specific lives in this class so the storage can be swapped without touching the views.
 * Data is read once and shared as signals; it is read-only for the public pages.
 */
@Injectable({providedIn: 'root'})
export class LibraryRepository {
  private readonly db = inject(AngularFireDatabase);

  /** All libraries in display order; `undefined` while loading. */
  readonly libraries = toSignal(
    this.db.object<Array<Biblio> | null>('bibliotheque').valueChanges().pipe(
      take(1),
      map(allLibraries => allLibraries ?? []),
      catchError(error => {
        console.error('Unable to load the libraries', error);
        return of([] as Array<Biblio>);
      })
    )
  );

  readonly isLoaded = computed(() => this.libraries() !== undefined);

  /** An unknown id resolves to the first library, as the app always did. */
  libraryById(libraryId?: string): Biblio | undefined {
    const index = LIBRARY_ORDER.indexOf(libraryId as Libraries);
    return this.libraries()?.[Math.max(index, 0)];
  }
}
