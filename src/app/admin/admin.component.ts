import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as csv from 'fast-csv';
import 'setimmediate';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  csvData: string;
  logs: string[] = [];

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor() { }

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
      csv.fromString(this.csvData, { headers: true, ignoreEmpty: true })
        .on("data", (data: any) => {
          this.log('record ' + data.Overall + ' is being read');
        })
        .on("end", () => {
          this.log('closing file');
        });
      
      setTimeout(() => {
        this.log('finished submitting');
      }, 100)
    }
  }

  log(message: string) {
    this.logs.push(new Date().toLocaleString() + ' ' + message);
  }

}
