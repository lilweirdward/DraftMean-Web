import { Component, OnInit, DoCheck, Inject } from '@angular/core';
import { Router } from '@angular/router';
// import { APP_BASE_HREF } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  // @Inject(APP_BASE_HREF) public baseHref: string
  constructor() { }

  loginVisible = false;
  navOpen = false;
  boardId = "";

  displayLogin() {
    this.loginVisible = !this.loginVisible;
  }

  updateBoardId(boardId: string) {
    this.boardId = boardId;
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
  }

  // @HostListener('click')
  // loginToBoard(boardId, teamName) {
  //   this.router.navigateByUrl(`/board/${boardId}`);
  //   return true;
  // }

}
