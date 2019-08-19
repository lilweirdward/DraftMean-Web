import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Board } from './models/board';
import { map } from 'rxjs/operators';

@Injectable()
export class BoardService {

  private boardUrl: string;
  private _boards: BehaviorSubject<Board[]>;
  private dataStore: {
    boards: Board[]
  };

  constructor(
    private http: HttpClient
  ) {
    this.boardUrl = `${environment.apiUrl}/api/boards`;
    this.dataStore = { boards: [] };
    this._boards = <BehaviorSubject<Board[]>>new BehaviorSubject([]);
  }

  get boards(): Observable<Board[]> {
    return this._boards.asObservable();
  }

  getAllBoards() {
    this.http.get<Board[]>(`${this.boardUrl}/`).subscribe(data => {
      this.dataStore.boards = data;
      this._boards.next(Object.assign({}, this.dataStore).boards);
    }, error => console.log('Unable to load all boards. Error: ' + error.error));
  }

  getBoard(boardId: string) {
    if (boardId) {
      this.http.get<Board>(`${this.boardUrl}/${encodeURIComponent(boardId)}`).subscribe(data => {
        const foundBoard = data;
        const alreadySavedItem = this.dataStore.boards.find(board => board.id === foundBoard.id);

        if (alreadySavedItem === undefined) {
          this.dataStore.boards.push(foundBoard);
        }

        this._boards.next(Object.assign({}, this.dataStore).boards);
      }, error => console.log('Unable to load board ' + boardId + '. Error: ' + error.error));
    }
  }

  createBoard(board: Board) {
    this.http.post<Board>(`${this.boardUrl}`, board).subscribe(data => {
      this.dataStore.boards.push(data);
      this._boards.next(Object.assign({}, this.dataStore).boards);
    }, error => console.log('Unable to save board: ' + JSON.stringify(board) + '. Error: ' + error.error));
  }

  updateBoard(board: Board) {
    this.http.put<Board>(this.boardUrl.toString(), board).subscribe(data => {
      const editedBoard = data;
      this.dataStore.boards.forEach((storeBoard, i) => {
        if (storeBoard.id === editedBoard.id) {
          this.dataStore.boards[i] = editedBoard;
        }
      });
      this._boards.next(Object.assign({}, this.dataStore).boards);
    }, error => console.log('Unable to update board: ' + JSON.stringify(board) + '. Error: ' + error.error));
  }

}
