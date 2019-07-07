import { Component, OnChanges, Input, SimpleChanges, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { TableBodyComponent } from './table-body/table-body.component';

import { Cell } from '../../models/Cell.model';
import { TableColumn } from '../../models/TableColumn.model';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss']
})
export class CustomTableComponent implements OnChanges, AfterViewInit {
  @ViewChild(TableBodyComponent, { static: false })
  private tableBody: TableBodyComponent;

  @Input() columnsList: TableColumn[];
  @Input() selectedColumnsList: string[];
  @Output() dataSelectedEvent: EventEmitter<any>;

  tableColumns: TableColumn[];
  tableCells: Cell[][];
  isEmpty: boolean;
  isDataSelected: boolean;

  filterQuery: string;
  selectedHeader: string;
  selectedHeaderIndex: number;

  constructor() {
    this.selectedColumnsList = [];
    this.columnsList = [];
    this.tableColumns = [];
    this.tableCells = [];
    this.isEmpty = true;
    this.selectedHeader = '';
    this.selectedHeaderIndex = -1;
    this.filterQuery = '';
    this.dataSelectedEvent = new EventEmitter();
  }

  ngAfterViewInit() { }

  ngOnChanges($changes: SimpleChanges): void {
    // console.log($changes);
    if ($changes.selectedColumnsList && !$changes.selectedColumnsList.firstChange) {
      this.updateTable($changes.selectedColumnsList.currentValue);
    }
  }

  sortAscending() {
    const tempTableCells = this.tableCells.slice();
    const isNumber = typeof tempTableCells[this.selectedHeaderIndex][0].data === 'number';
    const isString = typeof tempTableCells[this.selectedHeaderIndex][0].data === 'string';

    for (let i = 0; i < (tempTableCells[this.selectedHeaderIndex].length - 1); i++) {
      for (let j = 0; j < (tempTableCells[this.selectedHeaderIndex].length - i - 1); j++) {
        const x = tempTableCells[this.selectedHeaderIndex][j].data;
        const y = tempTableCells[this.selectedHeaderIndex][j + 1].data;

        if (isNumber && (x > y)) {
          // tslint:disable-next-line: prefer-for-of
          for (let k = 0; k < tempTableCells.length; k++) {
            const temp = tempTableCells[k][j].data;
            tempTableCells[k][j].data = tempTableCells[k][j + 1].data;
            tempTableCells[k][j + 1].data = temp;
          }
        } else if (isString && (String(x).localeCompare(String(y)) === 1)) {
          // tslint:disable-next-line: prefer-for-of
          for (let k = 0; k < tempTableCells.length; k++) {
            const temp = tempTableCells[k][j].data;
            tempTableCells[k][j].data = tempTableCells[k][j + 1].data;
            tempTableCells[k][j + 1].data = temp;
          }
        }
      }
    }
    this.tableCells = tempTableCells;
    this.tableBody.tableCells = this.tableCells;
    this.tableBody.resetDataCells();
  }

  sortDescending() {
    const tempTableCells = this.tableCells.slice();
    const isNumber = typeof tempTableCells[this.selectedHeaderIndex][0].data === 'number';
    const isString = typeof tempTableCells[this.selectedHeaderIndex][0].data === 'string';

    for (let i = 0; i < (tempTableCells[this.selectedHeaderIndex].length - 1); i++) {
      for (let j = 0; j < (tempTableCells[this.selectedHeaderIndex].length - i - 1); j++) {
        const x = tempTableCells[this.selectedHeaderIndex][j].data;
        const y = tempTableCells[this.selectedHeaderIndex][j + 1].data;

        if (isNumber && (x < y)) {
          // tslint:disable-next-line: prefer-for-of
          for (let k = 0; k < tempTableCells.length; k++) {
            const temp = tempTableCells[k][j].data;
            tempTableCells[k][j].data = tempTableCells[k][j + 1].data;
            tempTableCells[k][j + 1].data = temp;
          }
        } else if (isString && (String(x).localeCompare(String(y)) === -1)) {
          // tslint:disable-next-line: prefer-for-of
          for (let k = 0; k < tempTableCells.length; k++) {
            const temp = tempTableCells[k][j].data;
            tempTableCells[k][j].data = tempTableCells[k][j + 1].data;
            tempTableCells[k][j + 1].data = temp;
          }
        }
      }
    }
    this.tableCells = tempTableCells;
    this.tableBody.tableCells = this.tableCells;
    this.tableBody.resetDataCells();
  }

  sortDropdownClicked(sortDirection: string) {
    if (this.selectedHeader !== '' && sortDirection !== 'reset') {
      if (sortDirection === 'asc') {
        this.sortAscending();
      } else if (sortDirection === 'des') {
        this.sortDescending();
      }
    } else if (sortDirection === 'reset') {
      this.isDataSelected = false;
      this.tableBody.resetDataCells();
      this.updateTable(this.selectedColumnsList);
    } else {
      alert('Select a column header first!');
    }
  }

  filterButtonClicked($event: MouseEvent) {
    console.log('Filter button clicked [inside filterButtonClicked()]');
  }

  onFilterQueryChange($event: any) {
    console.log('Filter query input changed [inside onFilterQueryChange()]');
    this.filterQuery = $event.target.value;
  }

  private updateTable(selectedColumnsList: string[] | undefined = []): void {
    if (selectedColumnsList.length > 0) {
      this.isEmpty = false;
      this.tableColumns = this.selectedColumnsList.map(colName => {
      // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.columnsList.length; i++) {
          if (this.columnsList[i].colName === colName) {
            return this.columnsList[i];
          }
        }
      });
      this.tableCells = this.tableColumns.map((tableCol: TableColumn, colIndex: number) => {
        // returning an array of Cells stored Rowwise
        return tableCol.data.map((cell: Cell, rowIndex: number) => {
          return new Cell(rowIndex, colIndex, cell.data);
        });
      });
      for (let i = 0; i < this.selectedColumnsList.length; i++) {
        if (this.selectedHeader === this.selectedColumnsList[i]) {
          this.selectedHeaderIndex = i;
        }
      }
    } else {
      this.tableColumns = [];
      this.tableCells = [];
      this.isEmpty = true;
    }
  }

  receiveHeaderSelectionData($event: any) {
    const { colName } = $event;
    this.selectedHeader = colName;
    for (let i = 0; i < this.selectedColumnsList.length; i++) {
      if (this.selectedHeader === this.selectedColumnsList[i]) {
        this.selectedHeaderIndex = i;
      }
    }
  }

  receiveSelectedData($data: any) {
    this.isDataSelected = true;
    this.dataSelectedEvent.emit($data);
  }
}
