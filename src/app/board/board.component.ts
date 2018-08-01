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
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

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
  playersFullScreen = false;
  boardFullScreen = false;
  playersLoaded = false;
  boardLoaded = false;

  totalPicks: number;
  totalRounds: number;
  pickNumber: number;
  roundNumbers: number[];
  picks: number[];
  draftedPlayers: Player[];
  teams: Team[];
  totalTeams = "twelve";
  teamPlayers: Player[];

  constructor(
    private playerService: PlayerService,
    private boardService: BoardService,
    private route: ActivatedRoute,
    private location: Location,
    private titleService: Title,
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
        this.totalTeams = this.inEnglish(this.teams.length);
        // console.log(this.totalTeams);
        this.titleService.setTitle('DraftMean - ' + this.board.name);

        console.log('board loaded');
        this.boardLoaded = true;
      }
    );

    // Pull in all the players
    this.playerService.getPlayers(id).subscribe(
      players => {
        this.playersList = players.sort((a, b) => {
          return a.Rank < b.Rank ? -1 : 1;
        });
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
        if (environment.production) { console.log('PlayerUpdated: ' + JSON.stringify(data)) }

        var newPlayer = data.updatedPlayer;
        var playerToUpdate = _this.playersList.find(player => player.Rank == newPlayer.Rank);
        var updateIndex = _this.playersList.indexOf(playerToUpdate);
        
        if (environment.production) { console.log('updateIndex: ' + updateIndex) }

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

    var sortedPlayers = this.sortPlayersInTeamStructure(this.teamPlayers);

    this.dialog.open(TeamsDialog, {
      data: sortedPlayers
    });
  }

  inEnglish(number) {
    var ONE_TO_NINETEEN = [
      "one", "two", "three", "four", "five",
      "six", "seven", "eight", "nine", "ten",
      "eleven", "twelve", "thirteen", "fourteen", "fifteen",
      "sixteen", "seventeen", "eighteen", "nineteen"
    ];
    
    var TENS = [
      "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
    ];

    var tens, ones, words = [];

    if (number < 100) {
      if (number < 20) {
        return ONE_TO_NINETEEN[number - 1];
      }

      ones = number % 10;
      tens = number / 10 | 0;

      words.push(TENS[tens - 1]);
      words.push(this.inEnglish(ones));

      return words.filter(item => { return !!item }).join("-");
    }
  }

  movePlayers(direction: number) {
    if (direction == 1) { // go up
      if (this.boardFullScreen) { // screen at bottom
        this.boardFullScreen = !this.boardFullScreen; // move to middle
      } else if (!this.playersFullScreen) { // screen in middle
        this.playersFullScreen = !this.playersFullScreen; // move to top
      }
    } else if (direction == 2) { // go down
      if (this.playersFullScreen) { // screen at the top
        this.playersFullScreen = !this.playersFullScreen; // move to middle
      } else if (!this.boardFullScreen) { // screen in middle
        this.boardFullScreen = !this.boardFullScreen;
      }
    }
  }

  private sortPlayersInTeamStructure(unsortedPlayers: Player[]): Player[] {
    var sortedPlayers: Player[] = [];

    var qbs = unsortedPlayers.filter(p => p.Position.startsWith("QB"));
    var rbs = unsortedPlayers.filter(p => p.Position.startsWith("RB"));
    var wrs = unsortedPlayers.filter(p => p.Position.startsWith("WR"));
    var tes = unsortedPlayers.filter(p => p.Position.startsWith("TE"));
    var ks = unsortedPlayers.filter(p => p.Position.startsWith("K"));
    var defs = unsortedPlayers.filter(p => p.Position.startsWith("DEF"));

    console.log(rbs);
    console.log(wrs);

    var qb1 = qbs.shift();
    sortedPlayers.push(qb1 != null
      ? this.updatePlayerPos(qb1, "QB")
      : this.updatePlayerPos(new Player(), "QB"));

    var rb1 = rbs.shift();
    sortedPlayers.push(rb1 != null
      ? this.updatePlayerPos(rb1, "RB")
      : this.updatePlayerPos(new Player(), "RB"));

    var rb2 = rbs.shift();
    sortedPlayers.push(rb2 != null 
      ? this.updatePlayerPos(rb2, "RB") 
      : this.updatePlayerPos(new Player(), "RB"));

    var wr1 = wrs.shift();
    sortedPlayers.push(wr1 != null 
      ? this.updatePlayerPos(wr1, "WR") 
      : this.updatePlayerPos(new Player(), "WR"));

    var wr2 = wrs.shift();
    sortedPlayers.push(wr2 != null 
      ? this.updatePlayerPos(wr2, "WR") 
      : this.updatePlayerPos(new Player(), "WR"));

    var te = tes.shift();
    sortedPlayers.push(te != null 
      ? this.updatePlayerPos(te, "TE") 
      : this.updatePlayerPos(new Player(), "TE"));

    var flex = rbs.shift();
    if (flex == null) {
      flex = wrs.shift();
      if (flex == null) {
        flex = tes.shift();
        if (flex == null) {
          sortedPlayers.push(this.updatePlayerPos(new Player(), "FLEX"));
        } else {
          sortedPlayers.push(this.updatePlayerPos(flex, "FLEX"));
        }
      } else {
        sortedPlayers.push(this.updatePlayerPos(flex, "FLEX"));
      }
    } else {
      sortedPlayers.push(this.updatePlayerPos(flex, "FLEX"));
    }

    var k = ks.shift();
    sortedPlayers.push(k != null 
      ? this.updatePlayerPos(k, "K") 
      : this.updatePlayerPos(new Player(), "K"));

    var def = defs.shift();
    sortedPlayers.push(def != null 
      ? this.updatePlayerPos(def, "DEF") 
      : this.updatePlayerPos(new Player(), "DEF"));

    var bench = qbs.concat(rbs, wrs, tes, ks, defs);
    bench.sort((a, b) => {
      if (a.PickTaken < b.PickTaken) {
        return -1;
      } else if (a.PickTaken > b.PickTaken) {
        return 1;
      } else {
        return 0;
      }
    });

    for (var i = 0; i < 6; i++) {
      if (bench[i] == null) { bench.push(new Player()) }
    }

    bench.map((player) => {
      player.Position = "Bench"
    });

    sortedPlayers.push(...bench);

    return sortedPlayers;
  }

  private updatePlayerPos(player: Player, pos: string): Player {
    player.Position = pos;
    return player;
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