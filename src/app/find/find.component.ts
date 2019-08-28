import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Board } from '../models/board';
import { BoardService } from '../board.service';
import { FormGroup, FormControl } from '@angular/forms';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.scss']
})
export class FindComponent implements OnInit {

  findForm = new FormGroup({
    boardName: new FormControl('')
  });
  boards: Board[];

  constructor(
    private boardService: BoardService
  ) { }

  ngOnInit() {
  }

  searchBoards() {
    this.boards = [];

    const boardName = this.findForm.controls['boardName'].value;
    console.log(boardName);

    this.boardService.getAllBoards();
    this.boardService.boards.pipe(
      filter(boards => boards.length > 0),
      map(boards => boards.filter(b => b.name === boardName))
    ).subscribe(
      boards => {
        this.boards = boards;
      }
    );
  }

}
