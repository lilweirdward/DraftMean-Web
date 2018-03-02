import { Component, DoCheck, Input, ViewChild } from '@angular/core';
import { Player } from '../../models/player';
import { PlayerService } from '../../player.service';
import { SimpleChanges, AfterViewInit, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements DoCheck {

  constructor(
    private playerService: PlayerService
  ) {
    this.dataSource = new MatTableDataSource(this.playersList);
  }

  @Input() allPlayers: Player[];
  @Input() socket: any;
  playersList: Player[];
  dataSource: MatTableDataSource<Player>;

  columnsToDisplay = ['playerRank', 'playerName', 'playerTeam', 'playerPosition', 'playerByeWeek', 'draftPlayer'];

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  draftPlayer(player: Player) {

    var previousPick = Math.max.apply(Math, this.allPlayers.map(function(player) {
      return player.PickTaken;
    }));
    var currentPick = previousPick + 1;

    player.PickTaken = currentPick;

    try {
      this.playerService.editPlayers(player, this.socket);
      console.log('Update successful');
    } catch (e) {
      console.error(e);
    }
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   // if (this.allPlayers) {
  //   //   this.playersList = this.allPlayers.filter(player => player.PickTaken == null);
  //   //   this.dataSource = new MatTableDataSource(this.playersList);
  //   //   // this.dataSource.paginator = this.paginator;
  //   // }
  // }

  ngDoCheck() {
    if (this.allPlayers) {
      this.playersList = this.allPlayers.filter(player => player.PickTaken == null);
      this.dataSource.data = this.playersList;
    }
  }

  // ngAfterViewInit() {
  //   if (this.dataSource) {
  //     // this.dataSource.paginator = this.paginator;
  //   } else {
  //     console.log('Data source populated with empty playersList');
  //     // this.dataSource.paginator = this.paginator;
  //   }
  // }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
