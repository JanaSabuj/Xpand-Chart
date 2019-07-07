import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnChanges {
  @Input() selectedData: any;
  @Input() offset: number;

  // tslint:disable-next-line: max-line-length
  chartsList = ['Bar Chart', 'Pie Chart', 'Sunburst', 'Scatter Plot', 'Line Plot', 'Bubble Plot', 'Stacked Area Plot', 'Box Plot', 'Violin Plot'];
  possibleCharts: string[];
  legendData: Array<any>;
  currentDisplay: string;
  legendElementHovered: any;

  constructor() {
    this.currentDisplay = '';
    this.possibleCharts = [];
  }

  ngOnChanges($changes: any) {
    // console.log($changes);
    if ($changes.selectedData && !$changes.selectedData.firstChange) {
      if ($changes.selectedData.currentValue.length === 0) {
        this.currentDisplay = '';
        this.possibleCharts = [];
        // console.log('empty selection');
      } else {
        this.selectCharts($changes.selectedData.currentValue);
      }
    }
  }

  selectCharts(selectedData: any) {
    // console.log('select charts called');
    const noOfColumns = selectedData[0].length;
    const noOfRows = selectedData.length - 1;
    const primaryColumnObj = selectedData[selectedData.length - 1];

    if (primaryColumnObj.primaryColumn) {
      if (noOfColumns === 1) {
        this.possibleCharts = ['Bar Chart', 'Pie Chart'];
        if (noOfRows > 1) {
          if (typeof (primaryColumnObj.data[0]) === 'number') {
            this.possibleCharts.push('Line Plot', 'Stacked Area Plot');
          }
          // check primary column is grouped or not
          this.possibleCharts.push('Box Plot', 'Violin Plot');
        }
      } else if (noOfColumns === 2) {
        this.possibleCharts = ['Bar Chart', 'Sunburst'];

        if (noOfRows > 1) {
          if (typeof (primaryColumnObj.data[0]) === 'number') {
            this.possibleCharts.push('Line Plot', 'Stacked Area Plot');
          }
          this.possibleCharts.push('Scatter Plot');
        }
      } else if (noOfColumns === 3) {
        this.possibleCharts = ['Bar Chart', 'Bubble Plot', 'Sunburst'];
        if (noOfRows > 1) {
          if (typeof (primaryColumnObj.data[0]) === 'number') {
            this.possibleCharts.push('Line Plot', 'Stacked Area Plot');
          }
        }
      } else if (noOfColumns > 3) {
        this.possibleCharts = ['Bar Chart', 'Sunburst'];

        if (noOfRows > 1) {
          if (typeof (primaryColumnObj.data[0]) === 'number') {
            this.possibleCharts.push('Line Plot', 'Stacked Area Plot');
          }
        }
      }

      if (noOfRows === 1 && noOfColumns > 2) {
        this.possibleCharts.push('Pie Chart');
      }
    } else {
      if (noOfColumns === 1) {
        this.possibleCharts = ['Bar Chart', 'Pie Chart'];
        if (noOfRows > 1) {
          this.possibleCharts.push('Line Plot', 'Stacked Area Plot');
          // check primary column is grouped or not
          // this.possibleCharts.push('Box Plot', 'Violin Plot');
        }
      } else if (noOfColumns === 2) {
        this.possibleCharts = ['Bar Chart', 'Sunburst'];
        if (noOfRows > 1) {
          this.possibleCharts.push('Line Plot', 'Stacked Area Plot', 'Scatter Plot');
        }
      } else if (noOfColumns === 3) {
        this.possibleCharts = ['Bar Chart', 'Sunburst'];
        if (noOfRows > 1) {
          this.possibleCharts.push('Line Plot', 'Bubble Plot', 'Stacked Area Plot');
        }
      } else if (noOfColumns > 3) {
        this.possibleCharts = ['Bar Chart', 'Sunburst'];
        if (noOfRows > 1) {
          this.possibleCharts.push('Stacked Area Plot', 'Line Plot');
        }
      }

      if (noOfRows === 1 && noOfColumns > 2) {
        this.possibleCharts.push('Pie Chart');
      }
    }
  }

  updateLegend(data) {
    this.legendData = data;
  }

  onChartSelect(chartName: string) {
    this.currentDisplay = chartName;
  }

  updateChartHover(hoverObj: {name: string, color: string}) {
    this.legendElementHovered = hoverObj;
  }
}
