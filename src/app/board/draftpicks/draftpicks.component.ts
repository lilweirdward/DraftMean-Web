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

  constructor(
    public dialog: MatDialog,
    private playersService: PlayerService
  ) {
    this.player = new Player();
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
      }
    });
  }

  displayPlayer(rank: number) {
    const player = this.players.find(p => p.Rank === rank);
    this.dialog.open(PlayerDialog, {
      data: player
    });
  }

}
