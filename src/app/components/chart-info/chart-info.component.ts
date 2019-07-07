import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chart-info',
  templateUrl: './chart-info.component.html',
  styleUrls: ['./chart-info.component.scss']
})
export class ChartInfoComponent implements OnInit {
  @Output() chartClosedEvent: EventEmitter<any>;

  constructor() {
    this.chartClosedEvent = new EventEmitter();
  }

  ngOnInit() { }

  closeChart() {
    this.chartClosedEvent.emit('Chart closed');
  }
}
