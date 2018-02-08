import { Component, Input } from '@angular/core';
import { Player } from '../player';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

  totalPicks: number;
  picksPerRound: number = 12;
  totalRounds: number = 15;
  pickNumber: number;
  roundNumbers: number[];
  picks: number[];

  @Input() playersList: Player[];

  constructor() {
    this.totalPicks = this.picksPerRound * this.totalRounds;
    this.picks = Array(this.totalPicks).fill(1).map((x,i)=>i+1);
    // this.roundPicks = Array(this.picksPerRound).fill(1).map((x,i)=>i+1);
  }

}
