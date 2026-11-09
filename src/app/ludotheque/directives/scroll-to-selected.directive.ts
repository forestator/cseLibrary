import {afterNextRender, Directive, effect, ElementRef, inject, Injector, input} from '@angular/core';

/** Scrolls the host into view when its `id` is the selected one (id coming from the route). */
@Directive({
  selector: '[appScrollToSelected]',
})
export class ScrollToSelectedDirective {
  readonly appScrollToSelected = input<string>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  constructor() {
    effect(() => {
      const selectedId = this.appScrollToSelected();
      if (selectedId && selectedId === this.host.nativeElement.id) {
        // The cover images are not laid out yet: wait for the render before measuring.
        afterNextRender(() => this.host.nativeElement.scrollIntoView({behavior: 'smooth'}), {injector: this.injector});
      }
    });
  }
}
