import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { Player } from './player';

@Injectable()
export class PlayerService {

  apiUrl = 'http://raw.githubusercontent.com';
  playerUrl = 'http://raw.githubusercontent.com/lilweirdward/DraftMean-Web/master/src/assets/data/playerData.json';

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

}
