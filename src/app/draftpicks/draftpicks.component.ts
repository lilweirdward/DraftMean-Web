import { Component, OnInit, OnChanges, Input } from '@angular/core';
// import { TEAMS } from '../mock-teams';
// import { Team } from '../team';
import { Player } from '../player';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-draftpicks',
  templateUrl: './draftpicks.component.html',
  styleUrls: ['./draftpicks.component.scss']
})
export class DraftpicksComponent implements OnInit, OnChanges {

  @Input() pick: number;
  // @Input() round: number;
  @Input() players: Player[];
  // team: Team;
  player: Player;
  upNext: boolean;
  snake: boolean;

  constructor() { }

  ngOnInit() {
    // this.pick = this.pick + (this.round * 12);
    this.upNext = false;
    this.snake = Math.ceil((this.pick / 12)) % 2 == 0;

    if (!this.player)
      this.player = new Player();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.players) {
      var actualPlayer = this.players.find(player => player.PickTaken == this.pick);
      if (actualPlayer)
        this.player = actualPlayer;

      var lastPlayer = this.players.find(player => player.PickTaken == (this.pick - 1));
      if (!actualPlayer && lastPlayer)
        this.upNext = true;
    }
  }

}
