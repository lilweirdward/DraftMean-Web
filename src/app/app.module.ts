import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { 
  MatTableModule, 
  MatInputModule, 
  MatProgressSpinnerModule, 
  MatPaginatorModule, 
  MatDialogModule, 
  MatSelectModule, 
  MatFormFieldModule, 
  MatCardModule, 
  MatButtonModule,
  MatTooltipModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { PlayersComponent, PlayerDialog } from './board/players/players.component';
import { DraftpicksComponent } from './board/draftpicks/draftpicks.component';
import { BoardComponent, TeamsDialog } from './board/board.component';
import { PlayerService } from './player.service';
import { BoardService } from './board.service';
import { AppRoutingModule } from './/app-routing.module';
import { CreateComponent } from './create/create.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { APP_BASE_HREF, NgClass, CommonModule } from '@angular/common';
import { FindComponent } from './find/find.component';


@NgModule({
  declarations: [
    AppComponent,
    PlayersComponent,
    DraftpicksComponent,
    BoardComponent,
    TeamsDialog,
    PlayerDialog,
    CreateComponent,
    HomeComponent,
    FindComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    CommonModule
  ],
  entryComponents: [BoardComponent, TeamsDialog, PlayerDialog],
  providers: [PlayerService, BoardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
