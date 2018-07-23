import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { Player } from './models/player';
import { environment } from '../environments/environment';

@Injectable()
export class PlayerService {

  apiUrl: String;
  playerUrl: string;

  constructor(
    private http: HttpClient
  ) {
    if (environment.production) {
      this.apiUrl = 'http://shrouded-brushlands-89967.herokuapp.com';
    } else {
      this.apiUrl = 'http://localhost:3000';
    }
    this.playerUrl = `${this.apiUrl}/api/players`;
  }

  getPlayers(boardId: string, limit: number = 400, page: number = 1): Observable<Player[]> {
    if (boardId) {
      // if (environment.production) { boardId = "WpeJAi%2F7kAAgLIBj" }
      return this.http.get(`${this.playerUrl}/${boardId}`, { params: { "limit": limit.toString(), "page": page.toString() } }).map(
        res => {
          return res["data"].docs as Player[];
        }
      );
    } else {
      return new Observable();
    }
  }

  addPlayers(player: Player): Observable<any> {
    return this.http.post(`${this.playerUrl}/`, player);
  }

  editPlayers(player: Player, socket: any) {
    // return this.http.put(`${this.playerUrl}`, player);
    socket.emit('updatePlayer', player);
  }

  editPlayersPUT(player: Player): Observable<any> {
    return this.http.put(`${this.playerUrl}/`, player);
  }

}
