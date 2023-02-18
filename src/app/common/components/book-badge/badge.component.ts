import {Component, Input, OnInit} from '@angular/core';
import {BookStatus} from 'src/app/models/author.model';
import {BoardGameCategory, BoardGameStatus} from '../../../models/boardGame.model';
import {Consoles} from '../../../models/videoGames.model';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit {

  @Input() status!: string;
  @Input() display: string = 'normal';

  txt!: string;
  bg!: string;
  fg!: string;

  constructor() {
  }

  ngOnInit(): void {
    if (this.status in BookStatus) {
      switch (this.status) {
        case BookStatus.NEW:
          this.txt = 'NOUVEAU';
          this.bg = 'chartreuse';
          this.fg = 'white';
          break;
        case BookStatus.AVAILABLE:
          this.txt = 'DISPONIBLE';
          this.bg = 'green';
          this.fg = 'white';
          break;
        case BookStatus.DECLASSED:
          this.txt = 'DECLASSE';
          this.bg = 'darkorange';
          this.fg = 'white';
          break;
        case BookStatus.MISSING:
          this.txt = 'PERDU!';
          this.bg = 'red';
          this.fg = 'white';
          break;
        case BookStatus.IN_PROJECT:
          this.txt = 'EN PROJET';
          this.bg = 'fuchsia';
          this.fg = 'white';
          break;
        default:
          this.txt = this.status.toString();
          this.bg = 'gray';
          this.fg = 'black';
          break;
      }
    } else if (this.status in BoardGameStatus) {
      switch (this.status) {
        case BoardGameStatus.EMPRUNTE:
          this.txt = 'EMPRUNTE';
          this.bg = 'darkorange';
          this.fg = 'white';
          break;
      }
    } else if (this.status in Consoles) {
      switch (this.status) {
        case Consoles.switch:
          this.txt = this.status;
          this.bg = '#fe0016';
          this.fg = 'white';
          break;
        case Consoles.ps4:
        case Consoles.ps5:
          this.txt = this.status.toUpperCase();
          this.bg = '#4b38d9';
          this.fg = 'white';
          break;
        case Consoles.xboxOne:
          this.txt = this.status;
          this.bg = '#4dd938';
          this.fg = 'white';
          break;
      }
    } else if (this.status in BoardGameCategory) {
      this.txt = this.status[0].toUpperCase() + this.status.substr(1).toLowerCase();
      switch (this.status) {
        case BoardGameCategory.duo:
          this.bg = '#d9ab38';
          this.fg = 'white';
          break;
        case BoardGameCategory.ambiance:
          this.bg = '#d93856';
          this.fg = 'white';
          break;
        case BoardGameCategory.culture:
          this.bg = '#b007e8';
          this.fg = 'white';
          break;
        case BoardGameCategory.familial:
          this.bg = '#4dd938';
          this.fg = 'white';
          break;
        case BoardGameCategory.strategie:
          this.bg = '#d93838';
          this.fg = 'white';
          break;
        case BoardGameCategory.puzzle:
          this.bg = '#b138d9';
          this.fg = 'white';
          break;
        case BoardGameCategory.enfant:
          this.bg = '#5d97e0';
          this.fg = 'black';
          break;
        case BoardGameCategory.escape:
          this.bg = '#11cba3';
          this.fg = 'black';
          break;
        case BoardGameCategory.abstrait:
          this.bg = '#d93838';
          this.fg = 'white';
          break;
        case BoardGameCategory.inclassable:
          this.bg = 'white';
          this.fg = 'black';
          break;
        case BoardGameCategory.enquete:
          this.bg = 'black';
          this.fg = 'white';
          break;
        case BoardGameCategory.coop:
          this.bg = '#e0610f';
          this.fg = 'white';
          break;
      }
    } else {
      this.txt = this.status.toString();
      this.bg = 'gray';
      this.fg = 'black';
    }
  }

}
