import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { Player } from './player';

@Injectable()
export class PlayerService {

  // apiUrl = 'http://localhost:3000';
  apiUrl = 'http://shrouded-brushlands-89967.herokuapp.com';
  // playerUrl = 'assets/data/playerData.json';
  playerUrl = `${this.apiUrl}/api/players`;

  constructor(
    private http: HttpClient
  ) { }

  getPlayers(): Observable<Player[]> {
    return this.http.get(this.playerUrl).map(
      res => {
        return res["data"].docs as Player[];
      }
    );
  }

  editPlayers(player: Player, socket: any) {
    // return this.http.put(`${this.playerUrl}`, player);
    socket.emit('updatePlayer', player);
  }

}
