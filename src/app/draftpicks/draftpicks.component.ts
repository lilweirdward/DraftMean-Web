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
  upNext: boolean;

  constructor() { }

  ngOnInit() {
    this.pick = this.pick + (this.round * 12);
    let currentPick = this.pick - (this.round * 12);
    if((this.round % 2) == 0)
      this.team = TEAMS[currentPick - 1];
    else
      this.team = TEAMS[12 - currentPick];

    this.upNext = false;
    if(this.team.picks[this.round]) 
      this.player = this.team.picks[this.round].playerDrafted;
    else {
      this.player = new Player(0,"","","",0);
      // player.Rank==0&&teams[(pick-(round*12)-2)].playerDrafted&&!teams[(pick-(round*12)-2)].playerDrafted.Rank==0
      if ((currentPick - 2) >= 0)
        if (TEAMS[(currentPick - 2)])
          if (TEAMS[(currentPick - 2)].picks[this.round])
            this.upNext = true;
    }
  }

}
