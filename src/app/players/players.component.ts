import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { PlayerService } from '../player.service';
import { Player } from '../player';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
  providers: [PlayerService]
})
export class PlayersComponent implements OnInit {

  constructor(
    private playerService: PlayerService
  ) { }

  playersList: Player[];

  ngOnInit(): void {
    this.playerService.getPlayers().subscribe(
      players => {
        this.playersList = players
        console.log(players)
      }
    );
  }

}
