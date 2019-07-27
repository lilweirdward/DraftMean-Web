import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Board } from './models/board';

@Injectable()
export class BoardService {

  apiUrl: String;
  boardUrl: String;

  constructor(
    private http: HttpClient
  ) {
    if (environment.production) {
      this.apiUrl = 'https://shrouded-brushlands-89967.herokuapp.com';
    } else {
      this.apiUrl = 'http://localhost:3000';
    }
    this.boardUrl = `${this.apiUrl}/api/boards`;
  }

  getAllBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.boardUrl}/`);
  }

  getBoard(boardId: string): Observable<Board> {
    if (boardId) {
      boardId = encodeURIComponent(boardId);
      return this.http.get<Board>(`${this.boardUrl}/${boardId}`);
    } else {
      return new Observable();
    }
  }

  createBoard(board: Board): Observable<any> {
    return this.http.post(`${this.boardUrl}`, board);
  }

  updateBoard(board: Board) {
    return this.http.put(this.boardUrl.toString(), board);
  }

}
