import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public imageIndexes: Array<number> = [];
  @ViewChild('slides', { static: false }) slide;

  constructor() { }

  ngOnInit() {
    let i: number = 1;
    while (i < 41) {
      this.imageIndexes.push(i);
      i++;
    }
  }

}
