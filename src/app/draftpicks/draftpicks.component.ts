import { Component, OnInit, Input } from '@angular/core';
import { DraftPick } from '../draftpick';

@Component({
  selector: 'app-draftpicks',
  templateUrl: './draftpicks.component.html',
  styleUrls: ['./draftpicks.component.scss']
})
export class DraftpicksComponent implements OnInit {

  @Input() pick: number;

  constructor() { }

  ngOnInit() {
  }

}
