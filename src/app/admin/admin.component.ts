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
                      var player = players.find(p => p.PlayerName == csvPlayer.PlayerName);
                      if (null == player) {
                        console.log(data.Overall + ' does not exist in BoardId ' + board.id);
                        this.playerService.addPlayers(csvPlayer).subscribe(
                          player => {
                            this.log('Successfully inserted player: ' + player);
                          }
                        );
                      } else {
                        this.log('Current player in Board ' + board.id + ': ' + data.Overall);
                        this.playerService.editPlayersPUT(csvPlayer).subscribe(
                          updatedPlayer => {
                            this.log('Successfully updated player: ' + updatedPlayer.PlayerName);
                          }
                        )
                      }
                    })
                    .on("end", () => {
                      this.log('end of file');
                    });
                }
              }
            );
          });

        }
      );

      // this.playerService.getPlayers(board.id, 1000).subscribe(
      //   players => {
      //     if (players.length == 0) { } // skip
      //     else {
      //       let playersNoLongerExist;
      //       players.forEach((player) => {
      //         var doesExist = masterCsvData.find(p => p.Overall == player.PlayerName);
      //         if (null == doesExist) {
      //           playersNoLongerExist.push(player);
      //         }
      //       });

      //       playersNoLongerExist.forEach((player) => {
      //         console.log(player);
      //         this.playerService.deletePlayers(player);
      //       });
      //     }
      //   }
      // )
      
      setTimeout(() => {
        this.log('finished submitting');
      }, 10000)
    }
  }

  unDraft(boardId: string) {

  }

  log(message: string) {
    this.logs.push(new Date().toLocaleString() + ' ' + message);
  }

}
