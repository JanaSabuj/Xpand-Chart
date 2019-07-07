import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrls: ['./chart-legend.component.scss']
})

export class ChartLegendComponent implements OnChanges {
  @Input() legendData: Array<any>;

  @Output() legendHover: EventEmitter<any>;

  constructor() {
    this.legendData = [];
    this.legendHover = new EventEmitter();
  }

  ngOnChanges($changes: SimpleChanges) {

    if ($changes.currentDisplay) {
      if ($changes.currentDisplay.currentValue === '') {
        this.legendData = [];
      }
    }
  }

  mouseOver($event: MouseEvent, legendObj: {name: string, color: string}) {
    this.legendHover.emit(legendObj);
  }

  mouseLeave($event: MouseEvent) {
    this.legendHover.emit({name: '', color: ''});
  }
}
