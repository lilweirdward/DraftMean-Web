import { Component, DoCheck, Input, ViewChild, Inject } from '@angular/core';
import { Player } from '../../models/player';
import { PlayerService } from '../../player.service';
import { MatTableDataSource, MatPaginator, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements DoCheck {

  constructor(
    private playerService: PlayerService,
    public dialog: MatDialog
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
    if (filterValue.startsWith('pos:')) {
      this.dataSource.filterPredicate = 
        (data, filter) => data.Position.trim().toLowerCase().indexOf(filter) != -1;
      filterValue = filterValue.substring(4);
    } else if (filterValue.startsWith('team:')) {
      this.dataSource.filterPredicate = 
        (data, filter) => data.Team.trim().toLowerCase().indexOf(filter) != -1;
      filterValue = filterValue.substring(5);
    } else if (filterValue.startsWith('name:')) {
      this.dataSource.filterPredicate = 
        (data, filter) => data.PlayerName.trim().toLowerCase().indexOf(filter) != -1;
      filterValue = filterValue.substring(5);
    } else if (filterValue.startsWith('bye:')) {
      this.dataSource.filterPredicate = 
        (data, filter) => data.ByeWeek != parseInt(filter);
      filterValue = filterValue.substring(4);
    } else {
      this.dataSource.filterPredicate = 
        (data, filter) => data.PlayerName.trim().toLowerCase().indexOf(filter) != -1
                       || data.Team.trim().toLowerCase().indexOf(filter) != -1
                       || data.Position.trim().toLowerCase().indexOf(filter) != -1;
    }

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayPlayer(rank: number) {
    var player = this.playersList.find(p => p.Rank == rank);
    this.dialog.open(PlayerDialog, {
      data: player
    });
  }

}


@Component({
  selector: 'dialog-player',
  templateUrl: './player-dialog.component.html'
})
export class PlayerDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}