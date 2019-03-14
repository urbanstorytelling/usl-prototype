import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-img-spinner',
  templateUrl: './img-spinner.component.html',
  styleUrls: ['./img-spinner.component.scss']
})
export class ImgSpinnerComponent implements OnInit {

  constructor() { }

  @Input() src: String;
  @Input() alt: String;

  loading = true;

  ngOnInit() { }

  onLoad() {
    this.loading = false;
  }

}
