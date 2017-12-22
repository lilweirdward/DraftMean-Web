import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { TeamsComponent } from './teams/teams.component';
import { PlayersComponent } from './players/players.component';
import { DraftpicksComponent } from './draftpicks/draftpicks.component';


@NgModule({
  declarations: [
    AppComponent,
    TeamsComponent,
    PlayersComponent,
    DraftpicksComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
