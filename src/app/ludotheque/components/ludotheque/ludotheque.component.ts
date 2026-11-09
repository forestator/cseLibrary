import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {AuthentificationService} from '../../../services/firebase/authentification.service';
import {GameGridComponent} from '../shared/game-grid/game-grid.component';
import {PageHeaderComponent} from '../shared/page-header/page-header.component';
import {TileCardComponent} from '../shared/tile-card/tile-card.component';

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
  imports: [GameGridComponent, PageHeaderComponent, TileCardComponent],
})
export class LudothequeComponent {
  protected readonly isLudoAdmin = toSignal(inject(AuthentificationService).isUserLudoAdmin$);

  protected readonly entries: ReadonlyArray<LudothequeEntry> = [
    {route: 'boardGames', title: 'Jeux de société', resume: 'Les jeux de société : duo, ambiance, stratégie, famille…', image: `${COVERS_URL}/categorie%20jeux%20de%20societe`},
    {route: 'videoGames', title: 'Jeux vidéos', resume: 'Consoles, accessoires et jeux vidéo.', image: `${COVERS_URL}/categorie%20jeux%20video`},
    {route: 'outsideGames', title: 'Grands jeux', resume: 'Pas forcément des jeux pour grands !', image: `${COVERS_URL}/categorie%20jeux%20bois`},
  ];
}
