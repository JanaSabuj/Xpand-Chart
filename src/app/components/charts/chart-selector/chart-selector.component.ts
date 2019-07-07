import { Component, Input, OnChanges, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { ChartButton } from '../../../models/ChartButton.model';

@Component({
  selector: 'app-chart-selector',
  templateUrl: './chart-selector.component.html',
  styleUrls: ['./chart-selector.component.scss']
})
export class ChartSelectorComponent implements OnChanges {
  @Input() chartsList: string[];
  @Input() possibleCharts: string[];
  @Output() chartSelectedEvent: EventEmitter<any>;

  buttonClicked: string;

  selectableCharts: ChartButton[];

  constructor() {
    this.chartSelectedEvent = new EventEmitter();

  }

  ngOnChanges($changes: SimpleChanges) {
    if ($changes.possibleCharts) {
      this.buttonClicked = '';
      this.selectableCharts = this.chartsList.map((chart: string) => {
        if ($changes.possibleCharts.currentValue.includes(chart)) {
          return new ChartButton(chart, false);
        } else {
          return new ChartButton(chart, true);
        }
      });
    }
  }

  chartClicked(chartName: string, isDisabled: boolean) {
    if (!isDisabled) {
      this.buttonClicked = chartName;
      this.chartSelectedEvent.emit(chartName);
    }
  }
}
