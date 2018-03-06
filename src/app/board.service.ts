import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Board } from './models/board';

@Injectable()
export class BoardService {

  apiUrl: String;
  boardUrl: String;

  constructor(
    private http: HttpClient
  ) {
    if (environment.production) {
      this.apiUrl = 'http://shrouded-brushlands-89967.herokuapp.com';
    } else {
      this.apiUrl = 'http://localhost:3000';
    }
    this.boardUrl = `${this.apiUrl}/api/boards`;
  }

  getBoard(boardId: string): Observable<Board> {
    if (boardId) {
      return this.http.get(`${this.boardUrl}/${boardId}`).map(
        res => {
          return res["data"] as Board
        }
      )
    } else {
      return new Observable();
    }
  }

  createBoard(board: Board) {
    return this.http.post(this.boardUrl.toString(), board);
  }

  updateBoard(board: Board) {
    return this.http.put(this.boardUrl.toString(), board);
  }

}