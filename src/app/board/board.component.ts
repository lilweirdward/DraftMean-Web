import { Component, OnInit, Input, DoCheck, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { PlayerService } from '../player.service';
import { Player } from '../models/player';
import { TEAMS } from '../models/mock-teams';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import * as io from 'socket.io-client';
// import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  providers: [PlayerService]
})
export class BoardComponent implements OnInit, DoCheck {

  playersList: Player[];
  socket;
  color = "accent";
  mode = "indeterminate";
  value = "50";
  playersLoaded = false;

  totalPicks: number;
  picksPerRound: number = 12;
  totalRounds: number = 15;
  pickNumber: number;
  roundNumbers: number[];
  picks: number[];
  draftedPlayers: Player[];
  teams = TEAMS;
  teamPlayers: Player[];

  constructor(
    private playerService: PlayerService,
    public dialog: MatDialog
  ) {
    this.totalPicks = this.picksPerRound * this.totalRounds;
    this.picks = Array(this.totalPicks).fill(1).map((x,i)=>i+1);
    this.roundNumbers = Array(this.totalRounds).fill(1).map((x,i)=>i+1);
    // this.roundPicks = Array(this.picksPerRound).fill(1).map((x,i)=>i+1);
  }

  ngOnInit(): void {
    this.playerService.getPlayers().subscribe(
      players => {
        this.playersList = players
        console.log('players loaded')
        this.playersLoaded = true
      }
    );
    this.socket = io(this.playerService.apiUrl);
  }

  ngDoCheck() {
    if (this.playersList) {
      // Socket stuff
      let _this = this;
      this.socket.on('PlayerUpdated', function(data) {
        console.log('PlayerUpdated: ' + JSON.stringify(data));
        var newPlayer = data.updatedPlayer;
        var playerToUpdate = _this.playersList.find(player => player.Rank == newPlayer.Rank);
        var updateIndex = _this.playersList.indexOf(playerToUpdate);
        console.log('updateIndex: ' + updateIndex);
        _this.playersList[updateIndex] = newPlayer;
      });

      // Set draftedPlayers for DraftPicks component
      this.draftedPlayers = this.playersList.filter(player => player.PickTaken > 0);
    }
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

  // ngOnChanges(changes: SimpleChanges) {
    // if (this.playersList) {
      
    // }
  // }

  // ngDoCheck() {
  //   if (this.playersList) {
  //     this.draftedPlayers = this.playersList.filter(player => player.PickTaken > 0);
  //   }
  // }

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