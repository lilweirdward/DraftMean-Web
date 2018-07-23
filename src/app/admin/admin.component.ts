import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as csv from 'fast-csv';
import 'setimmediate';
import { BoardService } from '../board.service';
import { PlayerService } from '../player.service';
import { Player } from '../models/player';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  csvData: string;
  logs: string[] = [];

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private boardService: BoardService,
    private playerService: PlayerService
  ) { }

  ngOnInit() {
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsText(file);
      reader.onload = () => {
        this.csvData = reader.result;
      }
      reader.onloadend = () => {
        this.log("Data loaded");
        // this.log(this.csvData);
      }
    }
  }

  onSubmit() {
    // TODO: get CSV data (future TODO: get CSV by file picker)
    // Get all boards (future TODO: dropdown to pick individual boards or all of them)
      // For each board
        // Get all players
        // Remove empty boards
        // Open file
          // For each file rec
            // If rec not in current players list, insert new player for board
            // Otherwise, update current player by rec
    if (this.csvData && this.csvData.length > 0) {
      this.boardService.getAllBoards().subscribe(
        boards => {
          var end = boards.length - 1;
          boards.forEach((board) => {
            this.playerService.getPlayers(board.id, 500).subscribe(
              players => {
                if (players.length == 0) {
                  this.log('Board ' + board.id + ' has no players');
                } else {
                  csv.fromString(this.csvData, { headers: true, ignoreEmpty: true })
                    .on("data", (data: any) => {
                      var player = players.find(p => p.PlayerName == data.Overall);
                      if (null == player) {
                        console.log(data.Overall + ' does not exist in BoardId ' + board.id);
                        var newPlayer = new Player(
                            parseInt(data.Rank),
                            data.Overall,
                            data.Team,
                            data.Pos,
                            parseInt(data.Bye),
                            parseInt(data.Best),
                            parseInt(data.Worst),
                            parseInt(data.Avg),
                            null,
                            null,
                            false,
                            null,
                            board.id
                        );
                        this.playerService.addPlayers(newPlayer).subscribe(
                          player => {
                            this.log('Successfully inserted player: ' + player);
                          }
                        );
                        // TODO: Add player to list for current board
                      } else {
                        this.log('Current player in Board ' + board.id + ': ' + data.Overall);
                        this.playerService.editPlayersPUT(player).subscribe(
                          updatedPlayer => {
                            this.log('Successfully updated player: ' + updatedPlayer);
                          }
                        )
                      }
                    })
                    .on("end", () => {
                      this.log('end of file');
                    });
                }
              }
            )
          });
        }
      );
      
      setTimeout(() => {
        this.log('finished submitting');
      }, 1000)
    }
  }

  log(message: string) {
    this.logs.push(new Date().toLocaleString() + ' ' + message);
  }

}
