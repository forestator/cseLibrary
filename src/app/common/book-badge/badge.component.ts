import {Component, Input, OnInit} from '@angular/core';
import {BookStatus} from 'src/app/models/author.model';
import {BoardGameStatus} from '../../models/boardGame.model';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit {

  @Input() status!: BookStatus | BoardGameStatus;
  @Input() display: string = 'normal';

  txt!: string;
  bg!: string;
  fg!: string;

  constructor() { }

  ngOnInit(): void {
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
  }

}
