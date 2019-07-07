import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges {
  @Input() selectedData: any;
  @Input() currentDisplay: string;
  @Input() offset: number;

  constructor() { }

  ngOnChanges($changes: SimpleChanges) {

  }
}
