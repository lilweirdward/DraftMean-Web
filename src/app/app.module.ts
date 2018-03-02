import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatInputModule, MatProgressSpinnerModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { PlayersComponent } from './board/players/players.component';
import { DraftpicksComponent } from './board/draftpicks/draftpicks.component';
import { BoardComponent, TeamsDialog } from './board/board.component';
import { PlayerService } from './player.service';
import { AppRoutingModule } from './/app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
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
    MatDialogModule,
    AppRoutingModule
  ],
  entryComponents: [BoardComponent, TeamsDialog],
  providers: [PlayerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
