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

    // this.player = this.players.filter(player => player.PickTaken == this.pick)[0];
    if (!this.player)
      this.player = new Player();

    // let currentPick = this.pick - (this.round * 12);
    // if((this.round % 2) == 0)
    //   this.team = TEAMS[currentPick - 1];
    // else
    //   this.team = TEAMS[12 - currentPick];

    // this.upNext = false;
    // if(this.team.picks[this.round]) 
    //   this.player = this.team.picks[this.round].playerDrafted;
    // else {
      // this.player 
      // // player.Rank==0&&teams[(pick-(round*12)-2)].playerDrafted&&!teams[(pick-(round*12)-2)].playerDrafted.Rank==0
      // if ((currentPick - 2) >= 0)
      //   if (TEAMS[(currentPick - 2)])
      //     if (TEAMS[(currentPick - 2)].picks[this.round])
      //       this.upNext = true;
    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    var actualPlayer = this.players.find(player => player.PickTaken == this.pick);
    if (actualPlayer)
      this.player = actualPlayer;
  }

}
