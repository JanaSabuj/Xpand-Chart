import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { TableColumn } from '../../../models/TableColumn.model';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import * as d3 from 'd3';
import { json } from 'd3';

@Component({
  selector: 'app-stacked-area',
  templateUrl: './stacked-area.component.html',
  styleUrls: ['./stacked-area.component.scss']
})
export class StackedAreaComponent implements OnChanges {

  @Input() data: TableColumn[];
  @Input() selectedData: any;

  private margin = {top: 10, right: 30, bottom: 30, left: 60};
  private width: number;
  private height: number;
  private xArray: Array<any>;
  private xMin: number;
  private xMax: number;
  private legendData: Array<any>;

  //// primary column has to be ordered


  constructor() {
    this.width =  580 - this.margin.left - this.margin.right;
    this.height = 520 - this.margin.top - this.margin.bottom;

  }

  ngOnChanges($changes) {

    if (this.selectedData[this.selectedData.length - 1].primaryColumn === true) {
      const  ans = [];
      this.xArray = [];
      this.xMax = Number.MIN_SAFE_INTEGER - 1;
      this.xMin = Number.MAX_SAFE_INTEGER + 1;
      // this.createChart();
      for (let i = 0; i < this.selectedData.length - 1; i++) {
        const k = this.selectedData[this.selectedData.length - 1].colName;
        let v = this.selectedData[this.selectedData.length - 1].data[i];
        if (typeof(v) !== 'string' ) {
          v = String(v);
        }
        const obj = {};
// tslint:disable-next-line: no-string-literal
        obj['year'] = v;
        this.xArray.push(v);

        for (let j = 0; j < this.selectedData[0].length; j++) {
          const arr: any = Object.values(this.selectedData[i][j]);

          // if (typeof(arr[1] === 'string')) { continue; }
          obj[ arr[0]] = arr[1];

          if (this.xMax < arr[1]) {
            this.xMax = arr[1];
          }

          if (arr[1] < this.xMin) {
            this.xMin = arr[1];
          }
        }
        ans.push(obj);
      }

      this.createChart(ans);
    } else {

      const ans = [];
      this.xArray = [];
      this.xMax = Number.MIN_SAFE_INTEGER - 1;
      this.xMin = Number.MAX_SAFE_INTEGER + 1;
      // this.createChart();
      for (let i = 0; i < this.selectedData.length - 1; i++) {
        const k = this.selectedData[this.selectedData.length - 1].colName;
        const obj = {};
// tslint:disable-next-line: no-string-literal
        obj['year'] = this.selectedData[i][0].rowNum + 1;
        this.xArray.push(this.selectedData[i][0].rowNum + 1);

        for (let j = 0; j < this.selectedData[0].length; j++) {
          const arr: any = Object.values(this.selectedData[i][j]);
          // if (typeof(arr[1] === 'string')) { continue; }
          obj[ arr[0]] = arr[1];

          if (this.xMax < arr[1]) {
            this.xMax = arr[1];
          }

          if (arr[1] < this.xMin) {
            this.xMin = arr[1];
          }
        }
        ans.push(obj);
      }
      this.createChart(ans);
    }


  }

  updateChartHover(legendObj: {name: string, color: string}) {
    if (legendObj.name === '' && legendObj.color === '') {
      this.updateChartOnHoverEnd();
    } else {
      this.updateChartOnHover(legendObj);
    }
  }

  private updateChartOnHoverEnd() {
    d3.select('#stackedarea').selectAll('.common-stack').style('opacity', '1');
  }

  private updateChartOnHover(hoverElement: {name: string, color: string}) {
    const stackChart = d3.select('#stackedarea');

    stackChart.selectAll('.common-stack').style('opacity', '.2');
    stackChart.selectAll(`.${hoverElement.name}`).style('opacity', '1');
  }

  private createChart(ans: any) {

    d3.select('#stackedarea').selectAll('svg').remove();

// append the svg object to the body of the page
    const svg = d3.select('#stackedarea')
      .append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform',
              'translate(' + this.margin.left + ',' + this.margin.top + ')');

    const data = ans;
// tslint:disable-next-line: max-line-length


     //////////
  // GENERAL //
  //////////
    // console.log(data);
    let keyArray = [];

    keyArray = Object.keys(data[0]);
    // console.log(keyArray);
    // console.log(this.xArray);


  // List of groups = header of the csv files
  // const keys = data[0].slice(1);
    const keys = Object.keys(data[0]).slice(1);

  // color palette
    const color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSet2);

  // stack the data?
    const stackedData = d3.stack()
    .keys(keys)
    (data);

  //////////
  // AXIS //
  //////////

  // Add X axis
    const x = d3.scaleLinear()
// tslint:disable-next-line: only-arrow-functions
    .domain(d3.extent(data, function(d: any) {
  return Number(d.year);
    }))
    .range([ 0, this.width ]);
    const xAxis = svg.append('g')
    .attr('transform', 'translate(0,' + this.height + ')')
    .call(d3.axisBottom(x).ticks(5));

    svg.append('text')
        .attr('class', 'x-label')
        .attr('text-anchor', 'end')
        .attr('x', this.width)
        .attr('y', this.height + 30)
        .style('font-size', '.65rem')
        .style('color', '#353535')
        .style('font-weight', '700')
        .style('text-transform', 'capitalize')
        .text(`${this.selectedData[this.selectedData.length - 1].colName}`);

    svg.append('text')
  .attr('class', 'y-label')
  .attr('text-anchor', 'end')
  .attr('y', 6)
  .attr('dy', '.75em')
  .attr('transform', 'rotate(-90)')
  .style('font-size', '.75rem')
  .style('color', '#353535')
  .style('font-weight', '700')
  .style('text-transform', 'capitalize')
  .text(`Area`);

  // Add Y axis
    // console.log(this.xMin);
    // console.log(this.xMax);

    const y = d3.scaleLinear()
    .domain([this.xMin, this.xMax * 4])
    .range([ this.height, 0 ]);
    svg.append('g')
    .call(d3.axisLeft(y).ticks(5));



  //////////
  // BRUSHING AND CHART //
  //////////

  // Add a clipPath: everything out of this area won't be drawn.
    const clip = svg.append('defs').append('svg:clipPath')
      .attr('id', 'clip')
      .append('svg:rect')
      .attr('width', this.width )
      .attr('height', this.height )
      .attr('x', 0)
      .attr('y', 0);

  // Add brushing
    const brush = d3.brushX()                 // Add the brush feature using the d3.brush function
// tslint:disable-next-line: max-line-length
      .extent([[0, 0], [this.width, this.height]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on('end', updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

  // Create the scatter variable: where both the circles and the brush take place
    const areaChart: any = svg.append('g')
    .attr('clip-path', 'url(#clip)');

  // Area generator
    const area = d3.area()
// tslint:disable: only-arrow-functions
    .x(function(d: any) { return x(d.data.year); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); });

    const jsonData = [];
    const t = this.selectedData[0].length;

  // Show the areas
    areaChart
    .selectAll('mylayers')
    .data(stackedData)
    .enter()
    .append('path')
    .attr('class', (d: any, j: any) => {
      return `common-stack ${d.key}`;
    })
      .style('fill', function(d: any, j: any): any {
        const temp = {
          name: d.key,
          color: `rgb(${255 *  (t - j) / t},${ 0 * j / t},${255 * j / t})`
        };

        jsonData.push(temp);
        return `rgb(${255 *  (t - j) / t},${ 0 * j / t},${255 * j / t})`;
      })
      .attr('d', area );
      // .on('mouseover', alert('Hello'));

  // Add the brushing
    areaChart
    .append('g')
      .attr('class', 'brush')
      .call(brush);

    let idleTimeout;
    function idled() { idleTimeout = null; }

  // A function that update the chart for given boundaries
    function updateChart() {
      const extent = d3.event.selection;

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if (!extent) {
        if (!idleTimeout) { return idleTimeout = setTimeout(idled, 350); } // This allows to wait a little bit
        x.domain(d3.extent(data, function(d: any) { return Number(d.year); }));
      } else {
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ]);
        areaChart.select('.brush').call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and area position
      xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5));
      areaChart
        .selectAll('path')
        .transition().duration(1000)
        .attr('d', area);
    }



    this.legendData = [...jsonData];




  }

} // end of class
