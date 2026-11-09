import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AuthentificationService} from '../../../services/firebase/authentification.service';
import {LibraryRepository} from '../../services/library.repository';

@Component({
  selector: 'app-bibliotheque',
  templateUrl: './bibliotheque.component.html',
  styleUrl: './bibliotheque.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AsyncPipe],
})
export class BibliothequeComponent {
  protected readonly authService = inject(AuthentificationService);
  protected readonly libraries = inject(LibraryRepository).libraries;
}
