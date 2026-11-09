import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {AuthentificationService} from '../../../services/firebase/authentification.service';

interface LudothequeEntry {
  route: string;
  title: string;
  resume: string;
  image: string;
}

const COVERS_URL = 'https://res.cloudinary.com/seo9axkp/image/upload/assets/categories/ludo';

@Component({
  selector: 'app-ludotheque',
  templateUrl: './ludotheque.component.html',
  styleUrl: './ludotheque.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class LudothequeComponent {
  protected readonly isLudoAdmin = toSignal(inject(AuthentificationService).isUserLudoAdmin$);

  protected readonly entries: ReadonlyArray<LudothequeEntry> = [
    {route: 'boardGames', title: 'Jeux de société', resume: 'Les j2s', image: `${COVERS_URL}/categorie%20jeux%20de%20societe`},
    {route: 'videoGames', title: 'Jeux vidéos', resume: 'Les jeux vidéo !', image: `${COVERS_URL}/categorie%20jeux%20video`},
    {route: 'outsideGames', title: 'Grands jeux', resume: 'Pas forcément jeux pour grands !', image: `${COVERS_URL}/categorie%20jeux%20bois`},
  ];
}
