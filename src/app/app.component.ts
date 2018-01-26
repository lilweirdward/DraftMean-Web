import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { PlayerService } from './player.service';
import { Player } from './player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [PlayerService]
})
export class AppComponent implements OnInit {
  availablePlayers: Player[];
  chosenPlayers: Player[];
  playersList: Player[];

  constructor(
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    this.playerService.getPlayers().subscribe(
      players => {
        this.playersList = players
        // this.chosenPlayers = players.filter(player => player.PickTaken > 0)
        // console.log(players)
      }
    );
  }
}
