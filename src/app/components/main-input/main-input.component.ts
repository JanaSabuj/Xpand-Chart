import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Cell } from '../../models/Cell.model';
import { TableColumn } from '../../models/TableColumn.model';

@Component({
  selector: 'app-main-input',
  templateUrl: './main-input.component.html',
  styleUrls: ['./main-input.component.scss']
})
export class MainInputComponent implements OnInit {
  @Input() inputData: Array<any>;
  @Input() headers: string[];
  @Input() isDataLoaded: boolean;

  @Output() readDataEvent: EventEmitter<any>;
  @Output() readHeaders: EventEmitter<any>;
  @Output() readColumns: EventEmitter<any>;
  @Output() columnClick: EventEmitter<any>;
  @Output() dataSelectedEvent: EventEmitter<any>;

  columns: TableColumn[];
  selectedColumns: string[];

  constructor() {
    this.readDataEvent = new EventEmitter();
    this.readHeaders = new EventEmitter();
    this.readColumns = new EventEmitter();
    this.columnClick = new EventEmitter();
    this.dataSelectedEvent = new EventEmitter();
  }

  ngOnInit() {
  }

  extractColumns(inputData: any, headers: string[]) {
    const columnsList: TableColumn[] = [];
    for (let j = 0; j < headers.length; j++) {
      const cellList: Cell[] = [];
      for (let i = 0; i < inputData.length; i++) {
        cellList.push(new Cell(i, j, inputData[i][headers[j]]));
      }
      columnsList.push(new TableColumn(headers[j], cellList));
    }
    this.columns = [...columnsList];
    this.readColumns.emit(this.columns);
    // console.log(this.columns);
  }

  receiveInputData($event: any) {
    this.inputData = $event;
    if (this.inputData.length > 1) {
    // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.inputData.length; i++) {
        console.log(this.inputData[i]);
      }
    } else {
      const headers = Object.keys(this.inputData[0][0]);
      this.readHeaders.emit(headers);
      this.extractColumns(this.inputData[0], headers);
    }
    this.readDataEvent.emit(this.inputData);
  }

  updateSelectedColumns($updatedSelectedColumns: string[]) {
    this.selectedColumns = [...$updatedSelectedColumns];
  }

  receiveSelectedData($data: any) {
    this.dataSelectedEvent.emit($data);
  }
}
