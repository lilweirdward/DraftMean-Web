import { Component, OnInit, DoCheck, Input } from '@angular/core';
import { Player } from '../../models/player';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-draftpicks',
  templateUrl: './draftpicks.component.html',
  styleUrls: ['./draftpicks.component.scss']
})
export class DraftpicksComponent implements OnInit, DoCheck {

  @Input() pick: number;
  @Input() players: Player[];
  player: Player;
  upNext: boolean;
  snake: boolean;

  constructor() { }

  ngOnInit() {
    this.upNext = false;
    this.snake = Math.ceil((this.pick / 12)) % 2 == 0;

    if (!this.player)
      this.player = new Player();
  }

  ngDoCheck() {
    if (this.players) {
      var actualPlayer = this.players.find(player => player.PickTaken == this.pick);
      if (actualPlayer)
        this.player = actualPlayer;

      var lastPlayer = this.players.find(player => player.PickTaken == (this.pick - 1));
      if (!actualPlayer && lastPlayer)
        this.upNext = true;
      else
        this.upNext = false;
    }
  }

}
