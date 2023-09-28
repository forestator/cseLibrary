import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BookStatus} from 'src/app/models/author.model';
import {BoardGameCategory} from '../../../models/boardGame.model';
import {Consoles} from '../../../models/videoGames.model';
import {BorrowStatus} from '../../../admin/models/borrow.model';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit, OnChanges {

  @Input() status!: string;
  @Input() display: string = 'normal';

  txt!: string;
  bg!: string;
  fg!: string;

  constructor() {
  }

  ngOnInit(): void {
    this.setup();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['status']) {
      this.setup();
    }
  }

  private setup() {
    if (this.status in BookStatus) {
      this.bookStatusBadge();
    } else if (this.status in BorrowStatus) {
      this.borrowStatus();
    } else if (this.status in Consoles) {
      this.consoleBadge();
    } else if (this.status in BoardGameCategory) {
      this.boardGameCategoryBadge();
    } else {
      this.txt = this.status?.toString();
      this.bg = 'gray';
      this.fg = 'black';
    }
  }

  private boardGameCategoryBadge() {
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
  }

  private consoleBadge() {
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
  }

  private borrowStatus() {
    switch (this.status) {
      case BorrowStatus.EMPRUNTE:
        this.txt = 'EMPRUNTE';
        this.bg = 'darkorange';
        this.fg = 'white';
        break;
      case BorrowStatus.RETURNED:
        this.txt = 'DISPONIBLE';
        this.bg = 'green';
        this.fg = 'white';
        break;
      case BorrowStatus.LATE :
        this.txt = 'En Retard';
        this.bg = '#d93856';
        this.fg = 'white';
        break;
      case BorrowStatus.RESERVED:
        this.txt = 'RESERVE';
        this.bg = '#e0610f';
        this.fg = 'white';
        break;
    }
  }

  private bookStatusBadge() {
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
