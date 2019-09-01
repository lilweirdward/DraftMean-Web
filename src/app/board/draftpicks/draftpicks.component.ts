import { Component, OnInit, DoCheck, Input } from '@angular/core';
import { Player } from '../../models/player';
import { MatDialog } from '../../../../node_modules/@angular/material';
import { PlayerDialog } from '../players/players.component';
import { PlayerService } from 'src/app/player.service';

@Component({
  selector: 'app-draftpicks',
  templateUrl: './draftpicks.component.html',
  styleUrls: ['./draftpicks.component.scss']
})
export class DraftpicksComponent implements OnInit {

  @Input() pick: number;
  @Input() totalTeams: number;
  players: Player[] = [];
  player: Player;
  upNext = false;
  snake: boolean;
  timePerPick = 90;
  minutesRemaining = 0;
  secondsRemaining = 0;
  timer: IntervalTimer;

  constructor(
    public dialog: MatDialog,
    private playersService: PlayerService
  ) {
    this.player = new Player();
    this.timer = new IntervalTimer();
  }

  ngOnInit() {
    this.snake = Math.ceil((this.pick / this.totalTeams)) % 2 === 0;
    this.playersService.players.subscribe(playersList => {
      this.players = playersList.filter(player => player.PickTaken > 0);
      const playerActuallyTaken = this.players.find(p => p.PickTaken === this.pick);
      if (playerActuallyTaken) {
        this.player = playerActuallyTaken;
      }

      const lastPlayerTaken = this.players.find(p => p.PickTaken === (this.pick - 1));
      if (!playerActuallyTaken && lastPlayerTaken) {
        this.upNext = true;
        this.minutesRemaining = Math.floor(this.timePerPick / 60);
        this.secondsRemaining = this.timePerPick % 60;
        if (!this.timer.timerId) {
          this.timer.start(() => {
            if (this.timePerPick > 0) {
              this.minutesRemaining = Math.floor(this.timePerPick / 60);
              this.timePerPick = this.timePerPick - 1;
              if (this.secondsRemaining === 0) {
                this.secondsRemaining = 59;
              } else {
                this.secondsRemaining = this.secondsRemaining - 1;
              }
            } else {
              this.secondsRemaining = 0;
            }
          }, 1000);
        }
      } else {
        this.timer.pause();
        this.upNext = false;
      }
    });
  }

  displayPlayer(rank: number) {
    const player = this.players.find(p => p.Rank === rank);
    this.dialog.open(PlayerDialog, {
      data: player
    });
  }

  pauseOrResume(): void {
    if (this.timer) {
      if (this.timer.state === 1) {
        this.timer.pause();
      } else {
        this.timer.resume();
      }
    }
  }

}

class IntervalTimer {
  timerId: number | boolean = false;
  private startTime = 0;
  private remaining = 0;
  private callback: () => void;
  private interval: number;

  state = 0; //  0 = idle, 1 = running, 2 = paused, 3= resumed

  start(callback: () => void, interval: number) {
    this.callback = callback;
    this.interval = interval;

    this.startTime = new Date().getDate();
    this.timerId = window.setInterval(callback, interval);
    this.state = 1;
  }

  pause() {
    if (this.state !== 1) { return; }

    this.remaining = this.interval - (new Date().getDate() - this.startTime);
    window.clearInterval(this.timerId as number);
    this.timerId = false;
    this.state = 2;
  }

  resume() {
    if (this.state !== 2) { return; }

    this.state = 3;
    window.setTimeout(() => this.timeoutCallback(), 500);
  }

  private timeoutCallback() {
    if (this.state !== 3) { return; }

    this.callback();

    this.startTime = new Date().getDate();
    this.timerId = window.setInterval(this.callback, this.interval);
    this.state = 1;
  }
}
