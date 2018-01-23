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

  constructor(
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    this.playerService.getPlayers().subscribe(
      players => {
        this.availablePlayers = players.filter(player => player.PickTaken == 0)
        this.chosenPlayers = players.filter(player => player.PickTaken > 0)
        // console.log(players)
      }
    );
  }
}
