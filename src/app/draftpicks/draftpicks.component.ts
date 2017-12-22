import { Component, OnInit, Input } from '@angular/core';
import { TEAMS } from '../mock-teams';
import { Team } from '../team';
import { Player } from '../player';

@Component({
  selector: 'app-draftpicks',
  templateUrl: './draftpicks.component.html',
  styleUrls: ['./draftpicks.component.scss']
})
export class DraftpicksComponent implements OnInit {

  @Input() pick: number;
  @Input() round: number;
  team: Team;
  player: Player;

  constructor() { }

  ngOnInit() {
    this.pick = this.pick + (this.round * 12);
    let currentPick = this.pick - (this.round * 12);
    this.team = TEAMS[currentPick - 1];
    if(this.team.picks[this.round]) {
      this.player = this.team.picks[this.round].playerDrafted;
    } else {
      this.player = new Player(0,"","","",0);
    }    
  }

}
