import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Player } from './models/player';
import { environment } from '../environments/environment';

@Injectable()
export class PlayerService {

  private playerUrl: string;
  private _players: BehaviorSubject<Player[]>;
  private dataStore: {
    players: Player[]
  };

  constructor(
    private http: HttpClient
  ) {
    this.playerUrl = `${environment.apiUrl}/api/players`;
    this.dataStore = { players: [] };
    this._players = <BehaviorSubject<Player[]>>new BehaviorSubject([]);
  }

  get players(): Observable<Player[]> {
    return this._players.asObservable();
  }

  getPlayers(boardId: string, limit: number = 500, page: number = 1) {
    if (boardId) {
      this.http.get(`${this.playerUrl}/${encodeURIComponent(boardId)}`, {
        params: {
          'limit': limit.toString(),
          'page': page.toString()
        }
      }).subscribe(data => {
        this.dataStore.players = data['data'].docs as Player[];
        this._players.next(Object.assign({}, this.dataStore).players);
      }, error => console.log('Unable to load players. Error: ' + error.error));
    }
  }

  addPlayers(player: Player) {
    return this.http.post(`${this.playerUrl}`, player).subscribe(data => {
      this.dataStore.players.push(data['data'] as Player);
      this._players.next(Object.assign({}, this.dataStore).players);
    }, error => console.log('Unable to add player: ' + JSON.stringify(player) + '. Error: ' + error.error));
  }

  // editPlayers(player: Player, socket: any) {
  //   // return this.http.put(`${this.playerUrl}`, player);
  //   socket.emit('updatePlayer', player);
  // }

  editPlayers(player: Player) {
    return this.http.put(`${this.playerUrl}`, player).subscribe(data => {
      const editedPlayer = data['data'] as Player;
      this.dataStore.players.forEach((storePlayer, i) => {
        if (storePlayer.Rank === editedPlayer.Rank) { this.dataStore.players[i] = editedPlayer; }
      });
      this._players.next(Object.assign({}, this.dataStore).players);
    }, error => console.log('Unable to edit player: ' + JSON.stringify(player) + '. Error: ' + error.error));
  }

  deletePlayers(player: Player) {
    this.http.delete(`${this.playerUrl}`, {
      params: {
        PlayerName: player.PlayerName,
        BoardId: player.BoardId
      }
    }).subscribe(data => {
      const deletedPlayer = data['data'] as Player;
      this.dataStore.players.forEach((storePlayer, i) => {
        if (storePlayer.Rank === deletedPlayer.Rank) { this.dataStore.players.splice(i, 1); }
      });
    }, error => console.log('Unable to delete player: ' + JSON.stringify(player) + '. Error: ' + error.error));
  }

}
