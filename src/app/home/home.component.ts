import { Component, OnInit, Inject } from '@angular/core';
// import { APP_BASE_HREF } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // @Inject(APP_BASE_HREF) public baseHref: string
  constructor() { }

  ngOnInit() {
  }

}
