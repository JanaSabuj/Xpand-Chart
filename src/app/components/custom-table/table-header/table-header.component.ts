import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent implements OnChanges {
  @Input() columnHeaders: string[];

  @Output() deleteColumnEvent: EventEmitter<string>;

  constructor() {
    this.columnHeaders = [];
    this.deleteColumnEvent = new EventEmitter();
  }

  ngOnChanges($changes: any) {
    // console.log($changes);
  }

  deleteButtonClicked($event: any, colName: string) {
    // console.log('Delete', colName);
    this.deleteColumnEvent.emit(colName);
  }
}
