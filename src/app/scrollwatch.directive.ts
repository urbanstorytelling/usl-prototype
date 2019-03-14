import { Directive, HostListener, Output, EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Directive({
  selector: '[appScrollwatch]'
})
export class ScrollwatchDirective {

  @Output() scrollTop = new EventEmitter();
  @Output() isTop = new ReplaySubject();
  @Output() isBottom = new ReplaySubject();

  @HostListener('scroll', ['$event'])
  onscroll(event) {
    const scrollTop = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const clientHeight = event.target.clientHeight;

    this.isTop.next(scrollTop === 0 ? true : false);
    this.isBottom.next(scrollTop + clientHeight === scrollHeight ? true : false);
    this.scrollTop.emit(scrollTop);

  }

  constructor() { }
}
