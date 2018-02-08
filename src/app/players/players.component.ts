import { Component, DoCheck, Input, ViewChild } from '@angular/core';
import { Player } from '../player';
import { PlayerService } from '../player.service';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements DoCheck {

  constructor(
    private playerService: PlayerService
  ) { }

  @Input() allPlayers: Player[];
  @Input() socket: any;
  playersList: Player[];
  dataSource = new MatTableDataSource(this.playersList);

  columnsToDisplay = ['playerRank', 'playerName', 'playerTeam', 'playerPosition', 'playerByeWeek'];

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  draftPlayer(player: Player) {
    console.log(player);

    var previousPick = Math.max.apply(Math, this.allPlayers.map(function(player) {
      return player.PickTaken;
    }));
    var currentPick = previousPick + 1;

    console.log(currentPick);

    player.PickTaken = currentPick;

    try {
      this.playerService.editPlayers(player, this.socket);
      console.log('Update successful');
    } catch (e) {
      console.error(e);
    }
  }

  ngDoCheck() {
    if (this.allPlayers) {
      this.playersList = this.allPlayers.filter(player => player.PickTaken == null);
      this.dataSource.data = this.playersList;
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
