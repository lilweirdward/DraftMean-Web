import { Component, OnInit, DoCheck, Input } from '@angular/core';
import { Player } from '../../models/player';
import { MatDialog } from '../../../../node_modules/@angular/material';
import { PlayerDialog } from '../players/players.component';

@Component({
  selector: 'app-draftpicks',
  templateUrl: './draftpicks.component.html',
  styleUrls: ['./draftpicks.component.scss']
})
export class DraftpicksComponent implements OnInit, DoCheck {

  @Input() pick: number;
  @Input() players: Player[];
  @Input() totalTeams: number;
  player: Player;
  upNext: boolean;
  snake: boolean;

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.upNext = false;
    this.snake = Math.ceil((this.pick / this.totalTeams)) % 2 == 0;

    if (!this.player)
      this.player = new Player();
  }

  ngDoCheck() {
    if (this.players) {
      var actualPlayer = this.players.find(player => player.PickTaken == this.pick);
      if (actualPlayer)
        this.player = actualPlayer;

      var lastPlayer = this.players.find(player => player.PickTaken == (this.pick - 1));
      if (!actualPlayer && lastPlayer)
        this.upNext = true;
      else
        this.upNext = false;
    }
  }

  displayPlayer(rank: number) {
    var player = this.players.find(player => player.Rank == rank);
    this.dialog.open(PlayerDialog, {
      data: player
    });
  }

}
