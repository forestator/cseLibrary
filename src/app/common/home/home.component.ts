import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private navigateService: NavigationService) { }

  ngOnInit(): void {
  }

  linkToComission(comission: 'bibliotheque' | 'ludotheque'): void {
    this.navigateService.goToComission(comission);
  }
}
