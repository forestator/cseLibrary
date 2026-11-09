import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  public adminMode: boolean = false;
  public mobilePhoneDisplay$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private scrollRetry = 0;

  scrollToId(id: string | undefined): void {
    if (id) {
      const target: HTMLElement | null = document.getElementById(id);
      if (target) {
        target.scrollIntoView({behavior: 'smooth'});
        this.scrollRetry = 0;
      } else if (this.scrollRetry < 10) {
        this.scrollRetry++;
        setTimeout(() => this.scrollToId(id), 500);
      }
    }
  }
}
