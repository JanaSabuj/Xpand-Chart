import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Cell } from '../../../models/Cell.model';
import { TableColumn } from 'src/app/models/TableColumn.model';

@Component({
  selector: 'app-table-body',
  templateUrl: './table-body.component.html',
  styleUrls: ['./table-body.component.scss']
})
export class TableBodyComponent implements OnChanges {
  @Input() tableCells: Cell[][];
  @Input() selectedColumns: string[];
  @Output() dataSelectionEvent: EventEmitter<any>;
  @Output() headerSelectionEvent: EventEmitter<any>;

  selectedData: Array<any>;
  displayCells: Cell[][];
  click1: any;
  click2: any;
  prevClick: string;

  selectedColumnHead: string;
  primaryColumn: string;
  primaryColumnIndex: number;

  highlightedRows: number[];
  highlightedColumns: number[];
  highlightedColumnsData: Array<{ colName: string, colData: any }>;

  constructor() {
    this.displayCells = [];
    this.selectedData = [];
    this.selectedColumnHead = '';
    this.primaryColumn = 'ID';
    this.primaryColumnIndex = -1;
    this.highlightedColumns = [];
    this.highlightedColumnsData = [];
    this.highlightedRows = [];
    this.click1 = null;
    this.click2 = null;
    this.prevClick = '';
    this.dataSelectionEvent = new EventEmitter();
    this.headerSelectionEvent = new EventEmitter();
  }

  ngOnChanges($changes: SimpleChanges) {
    if ($changes.tableCells) {
      this.click1 = null;
      this.click2 = null;
      this.selectedData = [];
      this.highlightedColumns = [];
      this.highlightedColumnsData = [];
      this.highlightedRows = [];
      this.convertColumnToRows($changes.tableCells.currentValue);
    }
  }

  convertColumnToRows(inputData: Cell[][] | undefined = []) {
    if (inputData.length > 0) {
      const data: Cell[][] = [];
      for (let i = 0; i < inputData[0].length; i++) {
        const tempArray = [];
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < inputData.length; j++) {
          tempArray.push(inputData[j][i]);
        }
        data.push(tempArray);
      }
      this.displayCells = data;
      // console.log(this.displayCells);
    } else {
      this.displayCells = [];
    }
  }

  resetDataCells() {
    for (const row of this.displayCells) {
      for (const col of row) {
        col.selected = false;
      }
    }
    this.click1 = null;
    this.click2 = null;
    this.selectedData = [];
    this.dataSelectionEvent.emit([]);
  }

  updateDataCells(click1: any, click2: any) {
    if (click1.r >= click2.r && click1.c <= click2.c) {
      for (let i = click2.r; i <= click1.r; i++) {
        for (let j = click1.c; j <= click2.c; j++) {
          this.displayCells[i][j].selected = true;
        }
      }
    } else if (click1.r <= click2.r && click1.c >= click2.c) {
      for (let i = click1.r; i <= click2.r; i++) {
        for (let j = click2.c; j <= click1.c; j++) {
          this.displayCells[i][j].selected = true;
        }
      }
    } else if (click1.r >= click2.r && click1.c >= click2.c) {
      for (let i = click2.r; i <= click1.r; i++) {
        for (let j = click2.c; j <= click1.c; j++) {
          this.displayCells[i][j].selected = true;
        }
      }
    } else {
      for (let i = click1.r; i <= click2.r; i++) {
        for (let j = click1.c; j <= click2.c; j++) {
          this.displayCells[i][j].selected = true;
        }
      }
    }
  }

  updateSelectedData(click1: {r: number, c: number} = this.click1, click2: {r: number, c: number} = this.click2): void {
    this.selectedData = [];
    const primaryColumn = {
      colName: this.primaryColumn,
      primaryColumn: false,
      data: []
    };
    if (this.primaryColumn !== 'ID') {
      primaryColumn.primaryColumn = true;
    }

    if (click1.r >= click2.r && click1.c <= click2.c) {
      for (let i = click2.r; i <= click1.r; i++) {
        const tempArr = [];
        if (this.primaryColumn !== 'ID') {
          primaryColumn.data.push(this.displayCells[i][this.primaryColumnIndex].data);
        }
        for (let j = click1.c; j <= click2.c; j++) {
          if (this.primaryColumnIndex === j) { continue; }
          const tempObj = {
            colName: this.selectedColumns[j],
            data: this.displayCells[i][j].data,
            rowNum: this.displayCells[i][j].row
          };
          tempArr.push(tempObj);
        }
        this.selectedData.push(tempArr);
      }
      this.selectedData.push(primaryColumn);
    } else if (click1.r <= click2.r && click1.c >= click2.c) {
        for (let i = click1.r; i <= click2.r; i++) {
          const tempArr = [];
          if (this.primaryColumn !== 'ID') {
            primaryColumn.data.push(this.displayCells[i][this.primaryColumnIndex].data);
          }
          for (let j = click1.c; j <= click2.c; j++) {
            if (this.primaryColumnIndex === j) { continue; }
            const tempObj = {
              colName: this.selectedColumns[j],
              data: this.displayCells[i][j].data,
              rowNum: this.displayCells[i][j].row
            };
            tempArr.push(tempObj);
          }
          this.selectedData.push(tempArr);
        }
        this.selectedData.push(primaryColumn);
    } else if (click1.r >= click2.r && click1.c >= click2.c) {

      for (let i = click2.r; i <= click1.r; i++) {
        const tempArr = [];
        if (this.primaryColumn !== 'ID') {
            primaryColumn.data.push(this.displayCells[i][this.primaryColumnIndex].data);
        }
        for (let j = click1.c; j <= click2.c; j++) {
          if (this.primaryColumnIndex === j) { continue; }
          const tempObj = {
            colName: this.selectedColumns[j],
            data: this.displayCells[i][j].data,
            rowNum: this.displayCells[i][j].row
          };
          tempArr.push(tempObj);
        }
        this.selectedData.push(tempArr);
      }
      this.selectedData.push(primaryColumn);
    } else {
      for (let i = click1.r; i <= click2.r; i++) {
        const tempArr = [];
        if (this.primaryColumn !== 'ID') {
          primaryColumn.data.push(this.displayCells[i][this.primaryColumnIndex].data);
        }
        for (let j = click1.c; j <= click2.c; j++) {
          if (this.primaryColumnIndex === j) { continue; }
          const tempObj = {
            colName: this.selectedColumns[j],
            data: this.displayCells[i][j].data,
            rowNum: this.displayCells[i][j].row
          };
          tempArr.push(tempObj);
        }
        this.selectedData.push(tempArr);
      }
      this.selectedData.push(primaryColumn);
    }
    // console.log(this.selectedData);
    this.dataSelectionEvent.emit(this.selectedData);
  }

  highlightColumn(colIndex: number) {
    for (const row of this.displayCells) {
      row[colIndex].selected = true;
    }
    this.highlightedColumns.push(colIndex);
    this.highlightedColumns.sort((a, b) => a - b);
  }

  resetColumn(colIndex: number, colName: string) {
    for (const row of this.displayCells) {
      row[colIndex].selected = false;
    }
    this.highlightedColumns = this.highlightedColumns.filter(col => col !== colIndex);
    this.highlightedColumnsData = this.highlightedColumnsData.filter(col => {
      return col.colName !== colName;
    });
    // console.log('column reset');
  }

  updateColumnSelectedData() {
    this.selectedData = [];
    const primaryColumn = {
      colName: this.primaryColumn,
      primaryColumn: false,
      data: []
    };
    if (this.primaryColumn !== 'ID') {
      primaryColumn.primaryColumn = true;
    }
    if (this.highlightedColumnsData.length > 0) {
      for (let i = 0; i < this.highlightedColumnsData[0].colData.length; i++) {
        const tempArr = [];
        if (this.primaryColumn !== 'ID') {
          primaryColumn.data.push(this.displayCells[i][this.primaryColumnIndex].data);
        }
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < this.highlightedColumnsData.length; j++) {
          if (this.primaryColumn === this.highlightedColumnsData[j].colName) { continue; }
          tempArr.push({
            colName: this.highlightedColumnsData[j].colName,
            data: this.highlightedColumnsData[j].colData[i].data,
            rowNum: this.highlightedColumnsData[j].colData[i].row
          });
        }
        this.selectedData.push(tempArr);
      }
      this.selectedData.push(primaryColumn);
    }
    // console.log('selected data:', this.selectedData);
    this.dataSelectionEvent.emit(this.selectedData);
  }

  colClicked($event: any, colName: string) {
    if (this.prevClick === 'row' || this.prevClick === 'cell') {
      this.resetDataCells();
      this.highlightedRows = [];
      this.prevClick = 'column';
    }
    let colIndex: number;
    for (let i = 0; i < this.selectedColumns.length; i++) {
      if (colName === this.selectedColumns[i]) {
        colIndex = i;
        break;
      }
    }
    if (this.highlightedColumns.includes(colIndex)) {
      this.resetColumn(colIndex, colName);
      this.updateColumnSelectedData();
      if (this.selectedColumnHead === colName) {
        this.selectedColumnHead = '';
        this.headerSelectionEvent.emit({ colName: '' });
      }
    } else if (this.selectedColumnHead !== colName) {
      this.highlightColumn(colIndex);
      this.highlightedColumnsData = [];
      for (const col of this.highlightedColumns) {
        this.highlightedColumnsData.push({
          colName: this.selectedColumns[col],
          colData: this.tableCells[col]
        });
      }
      this.updateColumnSelectedData();
      this.selectedColumnHead = colName;
      this.headerSelectionEvent.emit({ colName });
    } else {
      this.highlightedColumns = [];
      this.highlightedColumnsData = [];
      this.selectedColumnHead = '';
      this.updateColumnSelectedData();
      this.headerSelectionEvent.emit({ colName: '' });
    }
    this.prevClick = 'column';
  }

  resetRow(rowNum: number) {
    for (let i = 0; i < this.selectedColumns.length; i++) {
      this.displayCells[rowNum][i].selected = false;
    }
    this.highlightedRows = this.highlightedRows.filter(row => row !== rowNum);
  }

  highlightRow(rowNum: number) {
    for (let j = 0; j < this.selectedColumns.length; j++) {
      this.displayCells[rowNum][j].selected = true;
    }
    this.highlightedRows.push(rowNum);
    this.highlightedRows.sort((a, b) => a - b);
  }

  updateRowSelectedData() {
    this.selectedData = [];
    const primaryColumn = {
      colName: this.primaryColumn,
      primaryColumn: false,
      data: []
    };
    if (this.primaryColumn !== 'ID') {
      primaryColumn.primaryColumn = true;
    }
    if (this.highlightedRows.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.highlightedRows.length; i++) {
        const tempArr = [];
        if (this.primaryColumn !== 'ID') {
          primaryColumn.data.push(this.displayCells[this.highlightedRows[i]][this.primaryColumnIndex].data);
        }
        for (let j = 0; j < this.selectedColumns.length; j++) {
          if (this.primaryColumn === this.selectedColumns[j]) { continue; }
          tempArr.push({
            colName: this.selectedColumns[j],
            data: this.displayCells[this.highlightedRows[i]][j].data,
            rowNum: this.displayCells[this.highlightedRows[i]][j].row
          });
        }
        this.selectedData.push(tempArr);
      }
      this.selectedData.push(primaryColumn);
    }
    // console.log(this.selectedData);
    this.dataSelectionEvent.emit(this.selectedData);
  }

  rowClicked($event: MouseEvent, rowNum: number) {
    if (this.prevClick === 'column' || this.prevClick === 'cell') {
      this.resetDataCells();
      this.highlightedColumns = [];
      this.highlightedColumnsData = [];
      this.prevClick = 'row';
    }
    if (this.highlightedRows.includes(rowNum)) {
      this.resetRow(rowNum);
      this.updateRowSelectedData();
    } else {
      this.highlightRow(rowNum);
      this.updateRowSelectedData();
    }
    this.prevClick = 'row';
  }

  cellClicked($event: any, row: number, col: number) {
    if (this.prevClick === 'column' || this.prevClick === 'row') {
      this.resetDataCells();
      this.highlightedColumns = [];
      this.highlightedColumnsData = [];
      this.highlightedRows = [];
      this.prevClick = 'cell';
    }

    if (this.click1 === null && this.click2 === null) {
      this.displayCells[row][col].selected = !this.displayCells[row][col].selected;
      this.click1 = {
        r: row,
        c: col
      };
    } else if (this.click1 !== null && this.click2 === null) {
      if (this.click1.r === row && this.click1.c === col) {
        this.displayCells[row][col].selected = !this.displayCells[row][col].selected;
        this.click1 = null;
        this.click2 = null;
      } else if (col < this.click1.c) {
        this.click2 = {
          ...this.click1
        };
        this.click1 = {
          r: row,
          c: col
        };
        this.updateDataCells(this.click1, this.click2);
        this.updateSelectedData(this.click1, this.click2);
      } else {
        this.click2 = {
          r: row,
          c: col
        };
        this.updateDataCells(this.click1, this.click2);
        this.updateSelectedData(this.click1, this.click2);
      }
      // console.log('click1', this.click1);
      // console.log('click2', this.click2);
    } else if (this.click1 !== null && this.click2 !== null) {
      this.resetDataCells();
      this.displayCells[row][col].selected = true;
      this.click1 = {
        r: row,
        c: col
      };
      this.click2 = null;
    }
    this.prevClick = 'cell';
  }

  onPrimarySelect($event: MouseEvent, colName: string) {
    this.resetDataCells();
    if (this.primaryColumn !== colName) {
      this.primaryColumn = colName;
      for (let i = 0; i < this.selectedColumns.length; i++) {
        if (colName === this.selectedColumns[i]) {
          this.primaryColumnIndex = i;
          break;
        }
      }
      this.highlightedColumns = [];
      this.highlightedColumnsData = [];
      this.highlightedRows = [];
    } else if (this.primaryColumn === colName) {
      this.primaryColumn = 'ID';
      this.primaryColumnIndex = -1;
      this.highlightedColumns = [];
      this.highlightedColumnsData = [];
      this.highlightedRows = [];
    }
  }
}
