import { Component, OnInit, Input, Inject } from '@angular/core';
import { TEAMS } from '../mock-teams';
import { Player } from '../player';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  teams = TEAMS;
  @Input() playersList: Player[];
  teamPlayers: Player[];

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  displayTeam(pickNumber = 12) {
    this.teamPlayers = [];
    var totalRounds = 15;
    var playerPicks = Array(totalRounds).fill(0).map((x,i)=>i*12+pickNumber);
    playerPicks.forEach(function(e, i, arr) {
      /*
       * Outcome: Snake pick
       * Logic:
       *  e:                element
       *  i:                index
       *  if statement:     only change every other element
       *  1st parentheses:  get last pick of this round (e.g. 36)
       *  2nd parentheses:  get picks per round by dividing last pick by index, e.g. 36 / 3 = 12
       *  overall:          last pick (36) plus ppr (12) = 48 less pick number (4) = 44 plus one = 45
       */
      if (i % 2 != 0) { arr[i] = ((e-pickNumber)+((e-pickNumber)/i)-pickNumber+1) };
    });
    // playerPicks.forEach((e, i) => console.log(e + ", " + i));
    playerPicks.forEach(element => {
      var player: Player = this.playersList.find(player => player.PickTaken == element);
      if (player) this.teamPlayers.push(player);
    });
    this.dialog.open(TeamsDialog, {
      data: this.teamPlayers
    });
  }

}

@Component({
  selector: 'dialog-team-players',
  templateUrl: './teams-dialog.component.html'
})
export class TeamsDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}