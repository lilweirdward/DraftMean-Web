import { Component, OnChanges, Input } from '@angular/core';
import { Player } from '../player';
import { PlayerService } from '../player.service';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnChanges {

  constructor(
    private playerService: PlayerService
  ) { }

  @Input() allPlayers: Player[];
  playersList: Player[];

  draftPlayer(player: Player) {
    console.log(player);

    var previousPick = Math.max.apply(Math, this.allPlayers.map(function(player) {
      return player.PickTaken;
    }));
    var currentPick = previousPick + 1;

    console.log(currentPick);

    player.PickTaken = currentPick;
    this.playerService.editPlayers(player).subscribe(res => {
      console.log('Update successful')
    }, err => {
      console.error('Update unsuccessful')
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.allPlayers) {
      this.playersList = this.allPlayers.filter(player => player.PickTaken == null);
    }
  }

}
