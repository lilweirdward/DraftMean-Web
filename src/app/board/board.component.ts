import { Component, OnInit, Input, DoCheck, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { PlayerService } from '../player.service';
import { Player } from '../models/player';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import * as io from 'socket.io-client';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BoardService } from '../board.service';
import { Board } from '../models/board';
import { Team } from '../models/team';
// import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  providers: [PlayerService, BoardService]
})
export class BoardComponent implements OnInit, DoCheck {

  playersList: Player[];
  board: Board;
  socket;
  color = "accent";
  mode = "indeterminate";
  value = "50";
  playersLoaded = false;
  boardLoaded = false;

  totalPicks: number;
  totalRounds: number;
  pickNumber: number;
  roundNumbers: number[];
  picks: number[];
  draftedPlayers: Player[];
  teams: Team[];
  teamPlayers: Player[];

  constructor(
    private playerService: PlayerService,
    private boardService: BoardService,
    private route: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    // Initialize board, teams, and vars for board settings
    this.boardService.getBoard(id).subscribe(
      board => {
        this.board = board;
        this.teams = this.board.teams;
        
        this.totalRounds = this.board.totalRounds;
        this.totalPicks = this.teams.length * this.totalRounds;
        this.picks = Array(this.totalPicks).fill(1).map((x,i)=>i+1);
        this.roundNumbers = Array(this.totalRounds).fill(1).map((x,i)=>i+1);
        console.log('board loaded');
        this.boardLoaded = true;
      }
    );

    // Pull in all the players
    this.playerService.getPlayers(id).subscribe(
      players => {
        this.playersList = players;
        console.log('players loaded');
        this.playersLoaded = true;
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
    var playerPicks = Array(this.totalRounds).fill(0).map(
      (x,i) => i * this.teams.length + pickNumber
    );

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