import {Component, OnInit} from '@angular/core';
import {ToolsService} from './services/biblio/tools.service';
import {FirebaseDatabaseService} from './services/firebase/firebase-database.service';
import {NavigationService} from './services/navigation.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Cse';
  showLudothequeMenu?: boolean;
  showBibliothequeMenu?: boolean;
  showAdmin?: boolean;

  constructor(
    public firebaseDatabaseService: FirebaseDatabaseService,
    private navigationService: NavigationService,
    private toolService: ToolsService) {
  }

  ngOnInit() {
    this.navigationService.url$.subscribe(url => {
        this.showLudothequeMenu = url.includes('ludotheque');
        this.showBibliothequeMenu = url.includes('bibliotheque');
        this.showAdmin = url.includes('admin');
    });
  }

  scrollToTop() {
    this.toolService.scrollToId('top');
  }
}
