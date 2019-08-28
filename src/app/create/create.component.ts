import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material';
import { Board } from '../models/board';
import { Team } from '../models/team';
import { BoardService } from '../board.service';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {

  // totalTeams: number;
  totalTeamsValidOptions = Array(17).fill(1).map((x,i) => i+8);
  // totalTeamsChanged: MatSelectChange;
  // teams: number[];
  // totalRounds: number;
  totalRoundsValidOptions = Array(14).fill(1).map((x,i) => i+12);
  // board = new Board();
  createdBoard = new Board();
  private createdBoardSubscription: Subscription;
  submitted = false;

  boardForm = new FormGroup({
    name: new FormControl(''),
    totalRounds: new FormControl([]),
    totalTeams: new FormControl([]),
    teams: new FormArray([])
  });

  constructor(
    private boardService: BoardService,
    private titleService: Title
  ) {
    titleService.setTitle('DraftMean - New Board');
    this.boardForm.controls['totalTeams'].valueChanges.subscribe(totalTeams =>
      this.populateTeams(totalTeams));

    this.createdBoardSubscription = this.boardService.newBoard.subscribe(createdBoard => {
      this.createdBoard = createdBoard;
      this.submitted = true;
    });
  }

  get teams(): FormArray {
    return this.boardForm.controls['teams'] as FormArray;
  }

  populateTeams(totalTeams: number) {
    console.log(totalTeams);
    if (totalTeams > 0) {
      for (let i = 0; i < totalTeams; i++) {
        this.teams.push(new FormControl(''));
      }
    } else {
      this.teams.clear();
    }
  }

  onSubmit() {
    const board: Board = {
      id: null,
      name: this.boardForm.controls['name'].value,
      totalRounds: this.boardForm.controls['totalRounds'].value,
      teams: this.teams.getRawValue().map((val, i) => {
        const team: Team = {
          id: i,
          name: val,
          upNext: false
        };
        return team;
      }),
      dateCreated: new Date()
    };

    this.boardService.createBoard(board);
  }

  // remove this after development is finished
  // get diagnostic() { return JSON.stringify(this.board); }

}
