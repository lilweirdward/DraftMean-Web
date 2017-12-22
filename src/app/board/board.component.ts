import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  totalPicks: number = 48;
  picksPerRound: number = 12;
  pickNumber: number;
  roundNumbers: number[];
  roundPicks: number[];

  constructor() {
    this.roundNumbers = Array(this.totalPicks / this.picksPerRound).fill(1).map((x,i)=>i);
    this.roundPicks = Array(this.picksPerRound).fill(1).map((x,i)=>i+1);
  }

  ngOnInit() {
    this.pickNumber = 0;
  }

}
