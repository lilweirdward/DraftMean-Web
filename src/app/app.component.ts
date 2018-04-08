import { Component, OnInit, DoCheck, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor() { }

  loginVisible = false;
  boardId = "";

  displayLogin() {
    this.loginVisible = !this.loginVisible;
  }

  updateBoardId(boardId: string) {
    this.boardId = boardId;
  }

  // @HostListener('click')
  // loginToBoard(boardId, teamName) {
  //   this.router.navigateByUrl(`/board/${boardId}`);
  //   return true;
  // }

}
