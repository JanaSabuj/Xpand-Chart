import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faFileUpload, faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  faFileUpload = faFileUpload;
  faArrowCircleUp = faArrowCircleUp;
  uploadButtonInfo: string;
  loading: boolean;

  @Output() readEvent: EventEmitter<any>;

  constructor() {
    this.readEvent = new EventEmitter();
    this.loading = false;
    this.uploadButtonInfo = 'Upload a file';
  }

  ngOnInit() {}

  fileUploadChange($event: any) {
    this.updateButtonText($event.target.value);
    if ($event.target.files[0].size > 10000) {
      alert('The input file is very large. Your browser might take a few moments to completely load the file.');
    }
    this.handleFile($event);
  }

  updateButtonText(filePath: string) {
    let nameStartIndex = filePath.length - 1;
    let nameEndIndex = 0;
    for (let i = filePath.length - 1; i >= 0; i--) {
      if (filePath.charAt(i) === '\\') { break; }
      if (nameEndIndex < 30) { nameEndIndex++; }
      nameStartIndex--;
    }
    this.uploadButtonInfo = filePath.slice(nameStartIndex + 1, nameStartIndex + 1 + nameEndIndex).toString() + '...';
  }

  handleFile(event: any) {
    this.loading = true;
    const fileUpload = document.getElementById('fileUpload');
    const fileName = (fileUpload as HTMLInputElement).value;
    const files: FileList = (fileUpload as HTMLInputElement).files;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {type: 'array'});
      const sheetNames = Object.keys(workbook.Sheets);
      const jsonData = [];
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < sheetNames.length; i++) {
        const currentSheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[i]]);
        const name = sheetNames[i];
        jsonData.push(currentSheet);
      }
      // console.log(jsonData);
      this.readEvent.emit(jsonData);
      this.loading = false;
    };
    reader.readAsArrayBuffer(files[0]);
  }
  // input_dom_element: any.addEventListener(: any'change', handleFile: any,: any false);
}
