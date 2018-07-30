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
    if (this.csvData && this.csvData.length > 0) {
      var csvPlayers: Player[] = [];
      this.boardService.getAllBoards().subscribe(
        boards => {
          boards.forEach((board) => {
            this.playerService.getPlayers(board.id, 1000).subscribe(
              players => {
                if (players.length == 0) {
                  this.log('Board ' + board.id + ' has no players');
                } else {
                  csv.fromString(this.csvData, { headers: true, ignoreEmpty: true })
                    .on("data", (data: any) => {
                      var csvPlayer = new Player(
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
                      if (csvPlayers.length < 500) {
                        csvPlayers.push(csvPlayer);
                      }
                      var player = players.find(p => p.PlayerName == csvPlayer.PlayerName);
                      if (null == player) {
                        this.log(data.Overall + ' does not exist in BoardId ' + board.id);
                        this.playerService.addPlayers(csvPlayer).subscribe(
                          x => {
                            this.log('Successfully inserted player: ' + player.PlayerName);
                          }
                        );
                      } else {
                        this.log('Current player in Board ' + board.id + ': ' + data.Overall);
                        this.playerService.editPlayersPUT(csvPlayer).subscribe(
                          x => {
                            this.log('Successfully updated player: ' + player.PlayerName);
                          }
                        )
                      }
                    })
                    .on("end", () => {
                      this.log('end of file');
                      players.forEach((player) => {
                        var playerInFile = csvPlayers.find(p => p.PlayerName == player.PlayerName);
                        this.log('player in file: ' + JSON.stringify(playerInFile));
                        if (undefined === playerInFile) {
                          this.log('found player to delete: ' + player.PlayerName);
                          if (!player.PickTaken) {
                            this.playerService.deletePlayers(player).subscribe(
                              x => {
                                this.log('Successfully deleted player: ' + player.PlayerName);
                              }
                            )
                          } else {
                            this.log(player.PlayerName + ' has already been drafted in this board, so not deleting');
                          }
                        }
                      });
                    });
                }
              }
            );
          });

        }
      );
      
      setTimeout(() => {
        this.log('finished submitting');
      }, 60000)
    }
  }

  unDraft(boardId: string) {

  }

  log(message: string) {
    this.logs.push(new Date().toLocaleString() + ' ' + message);
  }

}
