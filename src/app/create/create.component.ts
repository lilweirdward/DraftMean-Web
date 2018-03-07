import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {

  constructor() { }

  totalTeams: number;
  totalTeamsValidOptions = Array(17).fill(1).map((x,i) => i+8);
  totalTeamsChanged: MatSelectChange;
  teams: number[];
  totalRounds: number;
  totalRoundsValidOptions = Array(14).fill(1).map((x,i) => i+12);

  populateTeams() {
    if (this.totalTeams)
      this.teams = Array(+this.totalTeams).fill(1).map((x,i)=>i+1);
    else
      this.teams = new Array();
  }

}
