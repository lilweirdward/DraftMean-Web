import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
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

  private socket: WebSocketSubject<Player>;

  constructor(
    private http: HttpClient
  ) {
    this.playerUrl = `${environment.apiUrl}/api/players`;
    this.dataStore = { players: [] };
    this._players = new BehaviorSubject([]) as BehaviorSubject<Player[]>;
  }

  initializeSocketConnection(): void {
    this.socket = new WebSocketSubject(environment.webSocketUrl);
    this.socket.subscribe(
      (player) => {
        console.log(player);
        this.updatePlayersObs(player);
      },
      (err) => console.error(err),
      () => console.warn('Completed!')
    );
    setInterval(() => {
      this.socket.next(new Player()); // essentially a ping
    }, 25000);
    window.addEventListener('beforeunload', (_) => this.deconstruct());
  }

  deconstruct(): void {
    this.socket.unsubscribe();
    this.socket.complete();
  }

  get players(): Observable<Player[]> {
    return this._players.asObservable();
  }

  getPlayers(boardId: string) {
    if (boardId) {
      this.http.get<Player[]>(`${this.playerUrl}/${encodeURIComponent(boardId)}`).subscribe(data => {
        this.dataStore.players = data.sort((a, b) => {
          if (a.Rank > b.Rank) {
            return 1;
          } else if (a.Rank < b.Rank) {
            return -1;
          } else {
            return 0;
          }
        });
        this._players.next(Object.assign({}, this.dataStore).players);
      }, error => console.log('Unable to load players. Error: ' + error.error));
    }
  }

  // addPlayers(player: Player) {
  //   return this.http.post(`${this.playerUrl}`, player).subscribe(data => {
  //     this.dataStore.players.push(data['data'] as Player);
  //     this._players.next(Object.assign({}, this.dataStore).players);
  //   }, error => console.log('Unable to add player: ' + JSON.stringify(player) + '. Error: ' + error.error));
  // }

  // editPlayers(player: Player) {
  //   return this.http.put(`${this.playerUrl}`, player).subscribe(data => {
  //     this.updatePlayersObs(data['data'] as Player);
  //   }, error => console.log('Unable to edit player: ' + JSON.stringify(player) + '. Error: ' + error.error));
  // }

  draftPlayer(player: Player) {
    return this.http.post<Player>(`${this.playerUrl}/${player.BoardId}/draft/${player.Rank}`, {
      PickTaken: player.PickTaken
    }, {}).subscribe(data => {
      this.updatePlayersObs(data);
    }, error => console.log('Unable to draft player: ' + JSON.stringify(player) + '. Error: ' + error.error));
  }

  deletePlayers(player: Player) {
    this.http.delete(`${this.playerUrl}`, {
      params: {
        PlayerName: player.PlayerName,
        BoardId: player.BoardId
      }
    }).subscribe(() => {
      this.dataStore.players.forEach((storePlayer, i) => {
        if (storePlayer.Rank === player.Rank) { this.dataStore.players.splice(i, 1); }
      });
      this._players.next(Object.assign({}, this.dataStore).players);
    }, error => console.log('Unable to delete player: ' + JSON.stringify(player) + '. Error: ' + error.error));
  }

  private updatePlayersObs(editedPlayer: Player) {
    this.dataStore.players.forEach((storePlayer, i) => {
      if (storePlayer.Rank === editedPlayer.Rank) { this.dataStore.players[i] = editedPlayer; }
    });
    this._players.next(Object.assign({}, this.dataStore).players);
  }

}
