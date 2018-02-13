import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatInputModule, MatProgressSpinnerModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { TeamsComponent, TeamsDialog } from './teams/teams.component';
import { PlayersComponent } from './players/players.component';
import { DraftpicksComponent } from './draftpicks/draftpicks.component';
import { BoardComponent } from './board/board.component';
import { PlayerService } from './player.service';


@NgModule({
  declarations: [
    AppComponent,
    TeamsComponent,
    PlayersComponent,
    DraftpicksComponent,
    BoardComponent,
    TeamsDialog
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  entryComponents: [TeamsComponent, TeamsDialog],
  providers: [PlayerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
