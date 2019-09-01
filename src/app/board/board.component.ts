import { Component, OnInit, Input, DoCheck, Inject, OnDestroy } from '@angular/core';
import { PlayerService } from '../player.service';
import { Player } from '../models/player';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BoardService } from '../board.service';
import { Board } from '../models/board';
import { Team } from '../models/team';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { map, filter } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  providers: [PlayerService, BoardService]
})
export class BoardComponent implements OnInit, OnDestroy {

  playersList: Player[];
  board: Board;
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
  _teams: BehaviorSubject<Team[]>;
  totalTeams = 'twelve';
  teamPlayers: Player[];

  constructor(
    private playerService: PlayerService,
    private boardService: BoardService,
    private route: ActivatedRoute,
    private titleService: Title,
    public dialog: MatDialog
  ) {
    this._teams = new BehaviorSubject([]) as BehaviorSubject<Team[]>;
    this.playerService.initializeSocketConnection();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    // Initialize board, teams, and vars for board settings
    this.boardService.getBoard(id);
    this.boardService.boards.pipe(
      filter(boards => boards.length > 0),
      map(boards => boards.find(board => board.id === id))
    ).subscribe(
      board => {
        this.board = board;
        this._teams.next(Object.assign({}, board).teams);

        // console.log(this.totalTeams);
        this.titleService.setTitle('DraftMean - ' + this.board.name);

        console.log('board loaded');
        this.boardLoaded = true;
      }
    );

    // Pull in all the players
    this.playerService.getPlayers(id);
    this.playerService.players.subscribe(players => {
      console.log('new set of players loaded');
      this.playersList = players;

      // Set draftedPlayers for DraftPicks component
      this.draftedPlayers = this.playersList.filter(player => player.PickTaken > 0);
    });

    // Subscribe to whenever we finally get teams and players so we can fill out all the metadata
    combineLatest(
      this._teams.asObservable(),
      this.playerService.players
    ).pipe(
      filter(([teams, players]) => teams.length > 0 && players.length > 0)
    ).subscribe(([teams, players]) => {
      this.teams = teams;

      // Fill out rounds data
      this.totalRounds = this.board.totalRounds;
      this.totalPicks = this.teams.length * this.totalRounds;
      this.picks = this.generateArray(this.totalPicks, (x, i) => i + 1);
      this.roundNumbers = this.generateArray(this.totalRounds, (x, i) => i + 1);
      this.totalTeams = this.inEnglish(this.teams.length);

      // Figure out teamUpNext
      const maxPickTaken = Math.max.apply(Math, this.playersList.map(((p) => p.PickTaken)));
      if (maxPickTaken !== Number.NEGATIVE_INFINITY) { // map will return this if nothing found
        if (Math.floor(maxPickTaken / this.teams.length) % 2 !== 0) {
          this.teams[this.teams.length - (maxPickTaken % this.teams.length) - 1].upNext = true;
        } else {
          this.teams[maxPickTaken % this.teams.length].upNext = true;
        }

        // Only reset last pick taken if current team is not drafting twice in a row
        if (maxPickTaken % this.teams.length !== 0) {
          if (Math.floor(maxPickTaken / this.teams.length) % 2 !== 0) {
            this.teams[this.teams.length - (maxPickTaken % this.teams.length)].upNext = false;
          } else {
            this.teams[maxPickTaken % this.teams.length - 1].upNext = false;
          }
        }
      }

      this.playersLoaded = true;
    });
  }

  ngOnDestroy(): void {
    this.playerService.deconstruct();
  }

  displayTeam(pickNumber = 12) {
    if (this.teams[0].id === 0) {
      // 0-indexing team IDs will mess up my math, so just pretend like they're 1-indexed
      pickNumber = pickNumber + 1;
    }

    const teamPlayers: Player[] = [];
    const localPlayersList = [...this.playersList]; // copy by value to new array
    const playerPicks = this.generateArray(
      this.totalRounds, (x, i) => i * this.teams.length + pickNumber
    );

    playerPicks.forEach((el, i, picks) => {
      /*
       * Outcome: Snake pick
       * Logic:
       *  if statement:     only change every other element
       *  1st parentheses:  get last pick of this round (e.g. 36)
       *  2nd parentheses:  get picks per round by dividing last pick by index, e.g. 36 / 3 = 12
       *  overall:          last pick (36) plus ppr (12) = 48 less pick number (4) = 44 plus one = 45
       */
      if (i % 2 !== 0) {
        picks[i] = ((el - pickNumber) + ((el - pickNumber) / i) - pickNumber + 1);
      }
    });

    playerPicks.forEach(pick => {
      const player = localPlayersList.find(p => p.PickTaken === pick);
      if (player) {
        teamPlayers.push(player);
      }
    });

    this.dialog.open(TeamsDialogComponent, {
      data: this.sortPlayersInTeamStructure(teamPlayers),
      minWidth: '50vw',
      maxWidth: '80vw',
      height: '80vh'
    });
  }

  inEnglish(value: number) {
    const ONE_TO_NINETEEN = [
      'one', 'two', 'three', 'four', 'five',
      'six', 'seven', 'eight', 'nine', 'ten',
      'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
      'sixteen', 'seventeen', 'eighteen', 'nineteen'
    ];

    const TENS = [
      'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
    ];

    let ones: number;
    let tens: number;
    const words: string[] = [];

    if (value < 100) {
      if (value < 20) {
        return ONE_TO_NINETEEN[value - 1];
      }

      ones = value % 10;
      tens = Math.floor(value / 10);

      words.push(TENS[tens - 1]);
      words.push(this.inEnglish(ones));

      return words.filter(item => !!item).join('-');
    }
  }

  movePlayers(direction: number) {
    if (direction === 1) { // go up
      if (this.boardFullScreen) { // screen at bottom
        this.boardFullScreen = !this.boardFullScreen; // move to middle
      } else if (!this.playersFullScreen) { // screen in middle
        this.playersFullScreen = !this.playersFullScreen; // move to top
      }
    } else if (direction === 2) { // go down
      if (this.playersFullScreen) { // screen at the top
        this.playersFullScreen = !this.playersFullScreen; // move to middle
      } else if (!this.boardFullScreen) { // screen in middle
        this.boardFullScreen = !this.boardFullScreen;
      }
    }
  }

  private generateArray(arraySize: number, fillFunc: (x: number, i: number) => number): number[] {
    return Array(arraySize).fill(1).map(fillFunc);
  }

  private sortPlayersInTeamStructure(unsortedPlayers: Player[]): Player[] {
    const sortedPlayers: Player[] = [];

    const qbs = unsortedPlayers.filter(p => p.Position.startsWith('QB'));
    const rbs = unsortedPlayers.filter(p => p.Position.startsWith('RB'));
    const wrs = unsortedPlayers.filter(p => p.Position.startsWith('WR'));
    const tes = unsortedPlayers.filter(p => p.Position.startsWith('TE'));
    const ks = unsortedPlayers.filter(p => p.Position.startsWith('K'));
    const defs = unsortedPlayers.filter(p => p.Position.startsWith('DST'));

    const qb1 = qbs.shift();
    sortedPlayers.push(qb1 != null
      ? this.updatePlayerPos(qb1, 'QB')
      : this.updatePlayerPos(new Player(), 'QB'));

    const rb1 = rbs.shift();
    sortedPlayers.push(rb1 != null
      ? this.updatePlayerPos(rb1, 'RB')
      : this.updatePlayerPos(new Player(), 'RB'));

    const rb2 = rbs.shift();
    sortedPlayers.push(rb2 != null
      ? this.updatePlayerPos(rb2, 'RB')
      : this.updatePlayerPos(new Player(), 'RB'));

    const wr1 = wrs.shift();
    sortedPlayers.push(wr1 != null
      ? this.updatePlayerPos(wr1, 'WR')
      : this.updatePlayerPos(new Player(), 'WR'));

    const wr2 = wrs.shift();
    sortedPlayers.push(wr2 != null
      ? this.updatePlayerPos(wr2, 'WR')
      : this.updatePlayerPos(new Player(), 'WR'));

    const te = tes.shift();
    sortedPlayers.push(te != null
      ? this.updatePlayerPos(te, 'TE')
      : this.updatePlayerPos(new Player(), 'TE'));

    let flex = rbs.shift();
    if (flex == null) {
      flex = wrs.shift();
      if (flex == null) {
        flex = tes.shift();
        if (flex == null) {
          sortedPlayers.push(this.updatePlayerPos(new Player(), 'FLEX'));
        } else {
          sortedPlayers.push(this.updatePlayerPos(flex, 'FLEX'));
        }
      } else {
        sortedPlayers.push(this.updatePlayerPos(flex, 'FLEX'));
      }
    } else {
      sortedPlayers.push(this.updatePlayerPos(flex, 'FLEX'));
    }

    const k = ks.shift();
    sortedPlayers.push(k != null
      ? this.updatePlayerPos(k, 'K')
      : this.updatePlayerPos(new Player(), 'K'));

    const def = defs.shift();
    sortedPlayers.push(def != null
      ? this.updatePlayerPos(def, 'DEF')
      : this.updatePlayerPos(new Player(), 'DEF'));

    const bench = qbs.concat(rbs, wrs, tes, ks, defs);
    bench.sort((a, b) => {
      if (a.PickTaken < b.PickTaken) {
        return -1;
      } else if (a.PickTaken > b.PickTaken) {
        return 1;
      } else {
        return 0;
      }
    });

    for (let i = 0; i < 6; i++) {
      if (bench[i] == null) { bench.push(new Player()); }
    }

    bench.map((player) => player.Position = 'Bench');

    sortedPlayers.push(...bench);

    return sortedPlayers;
  }

  private updatePlayerPos(player: Player, pos: string): Player {
    player.Position = pos;
    return player;
  }

}


@Component({
  selector: 'app-dialog-team-players',
  templateUrl: './teams-dialog.component.html'
})
export class TeamsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}
