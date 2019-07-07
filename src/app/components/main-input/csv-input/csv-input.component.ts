import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-csv-input',
  templateUrl: './csv-input.component.html',
  styleUrls: ['./csv-input.component.scss']
})
export class CsvInputComponent implements OnInit {

  data = null;
  @Output() readEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  parseCSV(csv: string) {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[String(headers[j]).trim()] = String(currentline[j]).trim();
      }
      result.push(obj);
    }
    this.data = [...result];
    if (this.data !== null) {
      this.sendData();
    }
  }

  readIn() {
    const fileUpload = document.getElementById('fileUpload');
    const fileName = (fileUpload as HTMLInputElement).value;
    const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;

    if (regex.test(fileName.toLowerCase())) {
      if (typeof (FileReader) !== 'undefined') {
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          this.parseCSV(e.currentTarget.result);
        };
        const files: FileList = (fileUpload as HTMLInputElement).files;
        reader.readAsText(files[0]);
      }
    }
  }

  sendData() {
    this.readEvent.emit(this.data);
  }
}
