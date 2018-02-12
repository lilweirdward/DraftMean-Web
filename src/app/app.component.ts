import { Component, OnInit, DoCheck } from '@angular/core';
import { Response } from '@angular/http';
import { PlayerService } from './player.service';
import { Player } from './player';
import * as io from 'socket.io-client';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [PlayerService]
})
export class AppComponent implements OnInit, DoCheck {
  availablePlayers: Player[];
  chosenPlayers: Player[];
  playersList: Player[];
  socket;
  color = "accent";
  mode = "indeterminate";
  value = "50";
  playersLoaded = false;

  constructor(
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    this.playerService.getPlayers().subscribe(
      players => {
        this.playersList = players
        console.log('players loaded')
        this.playersLoaded = true
      }
    );
    this.socket = io(this.playerService.apiUrl);
  }

  ngDoCheck() {
    if (this.playersList) {
      let _this = this;
      this.socket.on('PlayerUpdated', function(data) {
        console.log('PlayerUpdated: ' + JSON.stringify(data));
        var newPlayer = data.updatedPlayer;
        var playerToUpdate = _this.playersList.find(player => player.Rank == newPlayer.Rank);
        var updateIndex = _this.playersList.indexOf(playerToUpdate);
        console.log('updateIndex: ' + updateIndex);
        _this.playersList[updateIndex] = newPlayer;
      });
    }
  }


}
