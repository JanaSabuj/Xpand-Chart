import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges {
  @Input() selectedData: any;
  @Input() offset = 0;

  dataset: Array<any>;
  dataset1: Array<any>;
  models: Array<any>;
  globalMax: number;
  maximum: number;
  groupSpacing: number;

  legendData: any;

  margin = {top: 10, right: 30, bottom: 30, left: 60};

  constructor() {
    this.models = [];
    this.groupSpacing = 2;
  }

  ngOnChanges($changes: SimpleChanges)  {
    if ($changes.selectedData) {
      d3.select('#barchart').select('svg').remove();
      this.parseData();
      this.createChart(this.offset);
    }
    if ($changes.offset && !$changes.offset.firstChange) {
      d3.select('#barchart').select('svg').remove();
      this.createChart(this.offset);
    }
  }

  updateChartHover(legendObj: {name: string, color: string}) {
    if (legendObj.name === '' && legendObj.color === '') {
      this.updateChartOnHoverEnd();
    } else {
      this.updateChartOnHover(legendObj);
    }
  }

  parseData() {
    this.models = [];
    this.maximum = -9999998;
    // tslint:disable-next-line: prefer-for-of

    if (this.selectedData[this.selectedData.length - 1].primaryColumn === true) {
      for (let i = 0; i < this.selectedData.length - 1; i++) {
          let temp = Object.assign({}, {
            modelName: this.selectedData[this.selectedData.length - 1].data[i]
          });
          const arr = [];
          for (let j = 0; j < this.selectedData[0].length; j++) {
            if (typeof(this.selectedData[i][j].data) === 'string') { continue; }
            const obj = {
              name: this.selectedData[i][j].colName,
              value: this.selectedData[i][j].data
            };
            if (this.maximum < this.selectedData[i][j].data) {
              this.maximum = this.selectedData[i][j].data;
            }
            arr.push(obj);
          }
          temp = Object.assign(temp, { field: arr});
          this.models.push(temp);
        }
    } else {
      for (let i = 0; i < this.selectedData.length - 1; i++) {
          let temp = Object.assign({}, {
              modelName: 'ID' + String(this.selectedData[i][0].rowNum + 1)
          });
          const arr = [];
          for (let j = 0; j < this.selectedData[0].length; j++) {
            if (typeof(this.selectedData[i][j].data) === 'string') {
              continue;
            }
            const obj = {
            name: this.selectedData[i][j].colName ,
            value: this.selectedData[i][j].data
            };

            if (this.maximum < this.selectedData[i][j].data) {
              this.maximum = this.selectedData[i][j].data;
            }
            arr.push(obj);
          }
          temp = Object.assign(temp, { field: arr});
          this.models.push(temp);
        }
    }
  }

  private updateChartOnHoverEnd() {
    d3.select('#barchart').selectAll('.common-bar').style('opacity', '1');
  }

  private updateChartOnHover(hoverElement: {name: string, color: string}) {
    const barChart = d3.select('#barchart');

    barChart.selectAll('.common-bar').style('opacity', '.2');
    barChart.selectAll(`.bar--${hoverElement.name}`).style('opacity', '1');
  }

  private hoverRectEnd(name1: string, name2: string) {
    const barChart = d3.select('#barchart');
    barChart.selectAll(`.bar--${name1}--${name2}`).style('opacity', '1');

  }

  private hoverRect(name1: string, name2: string) {

    const barChart = d3.select('#barchart');
    barChart.selectAll(`.bar--${name1}--${name2}`).style('opacity', '0.6');

  }

  private createChart(offset: number): void {
    const data = this.models;
    const svg = d3.select('#barchart').append('svg')
        .attr('width', 560 + offset)
        .attr('height', 500);

    const contentWidth = (560 + offset) - this.margin.left - this.margin.right;
    const contentHeight = 500 - this.margin.top - this.margin.bottom;

    const x = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.2)
      .domain(data.map(d => d.modelName));

    const x1 = d3.scaleBand();
                // .padding(0.5);
// tslint:disable-next-line: prefer-const
    let rateNames = data[0].field.map( (d: { name: any; }) => d.name);
    x1.domain(rateNames).range([0, x.bandwidth()]);

    const y = d3.scaleLinear()
      .rangeRound([contentHeight, 0])
      // .domain([0, d3.max(data, function(modelName) { return d3.max(modelName.values, function(d) { return d.value; }); })]);
      .domain([0, this.maximum] );


    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');


    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(20));

    svg.append('text')
        .attr('class', 'x-label')
        .attr('text-anchor', 'end')
        .attr('x', contentWidth + 60)
        .attr('y', contentHeight + 40)
        .style('font-size', '.65rem')
        .style('color', '#353535')
        .style('font-weight', '700')
        .style('text-transform', 'capitalize')
        .text(`${this.selectedData[this.selectedData.length - 1].colName}`);

    const tooltip = d3.select('#barchart').append('div')
                      .attr('class', 'tooltip')
                      .style('opacity', 0);


    const offsetval = x1.bandwidth();
    const t = this.models[0].field.length;

    const jsonData = [];
    const columnHeaders = this.models[0].field.map(col => {
      return col.name;
    });

    const circleTooltip = {};
    for (let j = 0; j < this.models[0].field.length; j++) {
      g.selectAll(`.bar .field`)
        // tslint:disable: only-arrow-functions
        .data(data)
        .enter().append('rect')
        .attr('class', (d: any) => {

          return `common-bar bar--${d.field[j].name} bar--${d.field[j].name}--${d.modelName}`;
        })
        // tslint:disable-next-line: only-arrow-functions
        .style('fill', function(d) {
          const key = d.field[j].name;
          const value =  `rgb(${255 *  (t - j) / t},${ 0 * j / t},${255 * j / t})`;
          circleTooltip[key] = value;
          return `rgb(${255 *  (t - j) / t},${ 0 * j / t},${255 * j / t})`;
        })
        .attr('x', d => x(d.modelName) + offsetval * j)
        // tslint:disable-next-line: only-arrow-functions
        .attr('y', d => y(d.field[j].value) )
        .attr('rx', 2)
        .attr('width', x1.bandwidth() - this.groupSpacing)
        .attr('height', d => contentHeight - y(d.field[j].value))
        .on('mousemove', (d) => {

          tooltip.transition().duration(300).style('opacity', 1);  // tooltip effects
// tslint:disable-next-line: max-line-length
          tooltip.html(` <div class="tooltipWrapper"> <span class="dot" style = "background-color : ${circleTooltip[d.field[j].name]} ;" ></span> <span  style="font-weight: bold"> ${d.field[j].name} </span>:  <span>  ${d.field[j].value} </span> </div>`)
            .style('left', `${d3.event.pageX}px`)
            .style('top', `${(d3.event.pageY - 28)}px`);

          this.hoverRect(d.field[j].name, d.modelName);

        })
        .on('mouseout', (d) => {

          tooltip.transition().duration(100).style('opacity', 0);
          this.hoverRectEnd(d.field[j].name, d.modelName);
      });
      svg.selectAll('bar')
        .transition()
        .duration(200);

      jsonData.push({
        name: columnHeaders[j],
        color: `rgb(${255 *  (t - j) / t},${ 0 * j / t},${255 * j / t})`
      });
    }
    this.legendData = [...jsonData];
  }
}
