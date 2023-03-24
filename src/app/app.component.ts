import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ToolsService} from './services/biblio/tools.service';
import {NavigationService} from './services/navigation.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Cse';
  showLudothequeMenu?: boolean;
  showBibliothequeMenu?: boolean;
  showAdmin?: boolean;
  @ViewChild('top') topMenu: ElementRef;

  constructor(
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

  ngAfterViewInit() {
    this.toolService.mobilePhoneDisplay$.next(this.topMenu.nativeElement.offsetWidth < 400);
  }

  scrollToTop() {
    this.toolService.scrollToId('top');
  }
}
