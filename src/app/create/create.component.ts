import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material';
import { Board } from '../models/board';
import { Team } from '../models/team';
import { BoardService } from '../board.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {

  totalTeams: number;
  totalTeamsValidOptions = Array(17).fill(1).map((x,i) => i+8);
  totalTeamsChanged: MatSelectChange;
  teams: number[];
  totalRounds: number;
  totalRoundsValidOptions = Array(14).fill(1).map((x,i) => i+12);
  board = new Board();
  createdBoard = new Board();
  submitted = false;

  constructor(
    private boardService: BoardService,
    private titleService: Title
  ) {
    this.board.teams = new Array<Team>();
    titleService.setTitle("DraftMean - New Board");
  }

  populateTeams() {
    if (this.totalTeams) {
      this.teams = Array(+this.totalTeams).fill(1).map((x,i)=>i+1);
      this.board.teams = new Array<Team>();
      this.teams.forEach((val, i) => {
        this.board.teams[i] = new Team();
        this.board.teams[i].id = val;
      });
    }
    else {
      this.teams = new Array();
      this.board.teams = new Array<Team>();
    }
  }

  onSubmit() {
    try {
      this.boardService.createBoard(this.board).subscribe(
        (res) => {
          this.createdBoard = res.data as Board;
          console.log(this.createdBoard);
          this.submitted = true;
        }
      );
    } catch (e) {
      console.error(e);
    }
  }

  // remove this after development is finished
  // get diagnostic() { return JSON.stringify(this.board); }

}
