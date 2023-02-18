import {Component} from '@angular/core';
import {ToolsService} from './services/tools.service';
import {FirebaseDatabaseService} from './services/firebase-database.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Cse';

  constructor(
    public firebaseDatabaseService: FirebaseDatabaseService,
    private toolService: ToolsService) {
  }

  scrollToTop() {
    this.toolService.scrollToId('top');
  }
}
