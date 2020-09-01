import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { PlayersComponent, PlayerDialog } from './board/players/players.component';
import { DraftpicksComponent } from './board/draftpicks/draftpicks.component';
import { BoardComponent, TeamsDialogComponent } from './board/board.component';
import { PlayerService } from './player.service';
import { BoardService } from './board.service';
import { AppRoutingModule } from './/app-routing.module';
import { CreateComponent } from './create/create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { APP_BASE_HREF, NgClass, CommonModule } from '@angular/common';
import { FindComponent } from './find/find.component';


@NgModule({
  declarations: [
    AppComponent,
    PlayersComponent,
    DraftpicksComponent,
    BoardComponent,
    TeamsDialogComponent,
    PlayerDialog,
    CreateComponent,
    HomeComponent,
    FindComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
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
  entryComponents: [BoardComponent, TeamsDialogComponent, PlayerDialog],
  providers: [PlayerService, BoardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
