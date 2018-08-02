import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Board } from '../models/board';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.scss']
})
export class FindComponent implements OnInit {

  @ViewChild('boardName') boardName: ElementRef;
  boards: Board[];

  constructor(
    private boardService: BoardService
  ) { }

  ngOnInit() {
  }

  searchBoards() {
    this.boards = [];

    // console.log(this.boardName.nativeElement["value"]);
    // var allBoards: Board[];
    this.boardService.getAllBoards().subscribe(
      boards => {
        this.boards = boards.filter(b => b.name == this.boardName.nativeElement["value"]);
      }
    );
  }

}
