import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
      this.apiUrl = 'https://shrouded-brushlands-89967.herokuapp.com';
    } else {
      this.apiUrl = 'http://localhost:3000';
    }
    this.playerUrl = `${this.apiUrl}/api/players`;
  }

  getPlayers(boardId: string, limit: number = 500, page: number = 1): Observable<Player[]> {
    if (boardId) {
      boardId = encodeURIComponent(boardId);
      return this.http.get<Player[]>(`${this.playerUrl}/${boardId}`, { params: { "limit": limit.toString(), "page": page.toString() } });
    } else {
      return new Observable();
    }
  }

  addPlayers(player: Player): Observable<Player> {
    return this.http.post<Player>(`${this.playerUrl}`, player);
  }

  editPlayers(player: Player, socket: any) {
    // return this.http.put(`${this.playerUrl}`, player);
    socket.emit('updatePlayer', player);
  }

  editPlayersPUT(player: Player): Observable<Player> {
    return this.http.put<Player>(`${this.playerUrl}`, player);
  }

  deletePlayers(player: Player): Observable<any> {
    return this.http.delete(`${this.playerUrl}`, { params: { PlayerName: player.PlayerName, BoardId: player.BoardId } });
  }

}
