import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TableColumn } from '../../../models/TableColumn.model';

@Component({
  selector: 'app-column-selector',
  templateUrl: './column-selector.component.html',
  styleUrls: ['./column-selector.component.scss']
})
export class ColumnSelectorComponent implements OnChanges {
  @Input() columnHeaders: string[];
  @Input() columnData: TableColumn[];
  @Input() isDataLoaded: boolean;

  selectedColumns: string[];
  isEmpty: boolean;

  @Output() selectedColumnsUpdate: EventEmitter<any>;
  @Output() readDataEvent: EventEmitter<any>;

  constructor() {
    this.columnData = [];
    this.selectedColumns = [];
    this.isEmpty = true;
    this.isDataLoaded = false;
    this.selectedColumnsUpdate = new EventEmitter();
    this.readDataEvent = new EventEmitter();
  }

  ngOnChanges($changes: any) { }

  onColumnDelete($deletedColumnName: string) {
    // console.log($deletedColumn);
    this.columnHeaders.push($deletedColumnName);
    this.selectedColumns = this.selectedColumns.filter(colName => {
      return colName !== $deletedColumnName;
    });
    if (this.selectedColumns.length === 0) {
      this.isEmpty = true;
    }
    this.selectedColumnsUpdate.emit(this.selectedColumns);
  }

  onDrop($event: CdkDragDrop<string[]>) {
    this.isEmpty = false;
    if ($event.previousContainer !== $event.container) {
      transferArrayItem($event.previousContainer.data,
        $event.container.data,
        $event.previousIndex, $event.container.data.length);
      this.selectedColumnsUpdate.emit(this.selectedColumns);
    }
  }

  receiveInputData($event) {
    this.readDataEvent.emit($event);
  }
}
