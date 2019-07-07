import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { read } from 'cfb/types';
import { Alert } from 'selenium-webdriver';
import { text } from 'd3';
// import{ ChangeDetectorRef } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-line-plot',
  templateUrl: './line-plot.component.html',
  styleUrls: ['./line-plot.component.scss']
})
export class LinePlotComponent implements OnChanges {
  @ViewChild('lineplot', {static: false})
  @Input() selectedData: any;

  private margin = {top: 10, right: 30, bottom: 30, left: 60};
  private width: number;
  private height: number;
  private legendData: Array<any>;
  private xAxisName: any;

  constructor( ) {
    this.selectedData = [];
    this.width = 500 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnChanges($changes) {

    if ($changes.selectedData && this.selectedData.length !== 0) {
      if (this.selectedData[this.selectedData.length - 1].primaryColumn === true) {
        this.parseDataPrimary($changes.selectedData.currentValue);
      } else {
        this.parseDataID($changes.selectedData.currentValue);
      }
    }
  }

  updateChartHover(legendObj: {name: string, color: string}) {
    if (legendObj.name === '' && legendObj.color === '') {
      this.updateChartOnHoverEnd();
    } else {
      this.updateChartOnHover(legendObj);
    }
  }

  parseDataID(selectedData: any) {
    if (selectedData[0].length === 1) {
      const xValues = selectedData.slice(0, selectedData.length - 1).map(
        (row: {colName: string, data: any, rowNum: number}) => {
        return {
          xValue: row[0].rowNum + 1,
          xColName: 'ID'
        };
      });
      const yValues = selectedData.slice(0, selectedData.length - 1).map(
        (row: {colName: string, data: any, rowNum: number}) => {
        return {
          yValue: row[0].data,
          yColName: row[0].colName
        };
      });
      const data = [];
      for (let i = 0; i < xValues.length; i++) {
        data.push({
          xValue: xValues[i].xValue,
          xColName: xValues[i].xColName,
          yValue: yValues[i].yValue,
          yColName: yValues[i].yColName,
          pCol: 'ID'
        });
      }
      const maxElementX = d3.max(xValues.map(element => element.xValue));
      const maxElementY = d3.max(yValues.map(element => element.yValue));
      const minElementX = d3.min(xValues.map(element => element.xValue));
      const minElementY = d3.min(yValues.map(element => element.yValue));

      this.createChart(data, maxElementX, maxElementY, minElementX, minElementY);
    } else if (selectedData[0].length > 1) {
      const extractedData = selectedData.slice(0, selectedData.length - 1);
      const primaryColumnName = 'ID';
      const primaryColumn = extractedData.map(row => {
        return row[0].rowNum + 1;
      });
      const data = [];
      const yValues = [];

      for (const row of extractedData) {
        for (const col of row) {
          data.push(col);
        }
      }
      const nestedData = d3.nest()
                      .key((d: {colName: string, data: any, rowNum: number}) => d.colName)
                      .entries(data);
      const finalData = nestedData.map(key => {
        return {
          key: key.key,
          values: key.values.map((value: {colName: string, data: any, rowNum: number}, index: number) => {
            yValues.push(value.data);
            return {
              xValue: primaryColumn[index],
              xColName: primaryColumnName,
              yValue: value.data,
              yColName: value.colName
            };
          })
        };
      });

      const maxElementX = d3.max(primaryColumn);
      const maxElementY = d3.max(yValues);
      const minElementX = d3.min(primaryColumn);
      const minElementY = d3.min(yValues);
      this.createChartMultiple(finalData, primaryColumn, maxElementX, maxElementY, minElementX, minElementY);
    }
  }

  parseDataPrimary(selectedData: any) {
    if (selectedData[0].length === 1) {
      const xValues = selectedData[selectedData.length - 1].data.map((rowData, index) => {
        return {
          xValue: rowData,
          colName: selectedData[selectedData.length - 1].colName
        };
      });
      const yValues = selectedData.slice(0, selectedData.length - 1).map(row => {
        return {
          yValue: row[0].data,
          colName: row[0].colName
        };
      });
      const maxElementX = d3.max(xValues.map(element => element.xValue));
      const maxElementY = d3.max(yValues.map(element => element.yValue));
      const minElementX = d3.min(xValues.map(element => element.xValue));
      const minElementY = d3.min(yValues.map(element => element.yValue));
      const data = [];
      for (let i = 0; i < xValues.length; i++) {
        data.push({
          xValue: xValues[i].xValue,
          xColName: xValues[i].colName,
          yValue: yValues[i].yValue,
          yColName: yValues[i].colName
        });
      }

      this.createChart(data, maxElementX, maxElementY, minElementX, minElementY);
    } else if (selectedData[0].length > 1) {
      const primaryColumnName = selectedData[selectedData.length - 1].colName;
      const primaryColumn = selectedData[selectedData.length - 1].data;
      const extractedData = selectedData.slice(0, selectedData.length - 1);
      const data = [];
      const yValues = [];

      for (const row of extractedData) {
        for (const col of row) {
          data.push(col);
        }
      }
      const nestedData = d3.nest()
                      .key((d: {colName: string, data: any, rowNum: number}) => d.colName)
                      .entries(data);
      const finalData = nestedData.map(key => {
        return {
          key: key.key,
          values: key.values.map((value: {colName: string, data: any, rowNum: number}, index: number) => {
            yValues.push(value.data);
            return {
              xValue: primaryColumn[index],
              xColName: primaryColumnName,
              yValue: value.data,
              yColName: value.colName
            };
          })
        };
      });


      const maxElementX = d3.max(primaryColumn);
      const maxElementY = d3.max(yValues);
      const minElementX = d3.min(primaryColumn);
      const minElementY = d3.min(yValues);

      this.createChartMultiple(finalData, primaryColumn, maxElementX, maxElementY, minElementX, minElementY);
    }
  }

  private updateChartOnHoverEnd() {
    d3.select('#lineplot').selectAll('.common-line').style('opacity', '1');
  }

  private updateChartOnHover(hoverElement: {name: string, color: string}) {
    const lineChart = d3.select('#lineplot');

    lineChart.selectAll('.common-line').style('opacity', '.2');
    lineChart.select(`.${hoverElement.name}`).style('opacity', '1');
  }


  createChartMultiple(inputData: any, primaryCol: {colName: string, data: []}, xMax: number | string,
                      yMax: number | string, xMin: number | string, yMin: number | string) {
    d3.select('#lineplot').selectAll('svg').remove();



    const svg = d3.select('#lineplot')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right + 50)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    const x = d3.scaleLinear()
      .domain([Number(xMin), Number(xMax)])
      .range([0, this.width]);
    svg.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x).ticks(5));

    const y = d3.scaleLinear()
      .domain([Number(yMin), Number(yMax)])
      .range([this.height, 0]);
    svg.append('g')
      .call(d3.axisLeft(y));

    const res = inputData.map((d) => d.key);

    const color = d3.scaleOrdinal()
                    .domain(res)
                    .range(['#eb2f06', '#1e3799', '#4cd137', '#fbc531', '#273c75', '#0097e6', '#F79F1F', '#833471']);

    const jsonData = [];
    const t = this.selectedData[0].length;

    const tooltip = d3.select('#lineplot').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);


// tslint:disable: only-arrow-functions
    const bisect = d3.bisector(function(d: any) {

      return d.xValue;

    }).left;



    const focus = svg.append('g')
    .attr('class', 'focus')
    .style('display', 'none');

    for (let i = 0; i < inputData.length; i++) {

      focus.append('g')
        .attr('class', 'focus' + i)
        .append('circle')
        // .attr('class','circle'+i)
        .style('stroke', 'black')
        .style('stroke-width', 0.5)
        .style('fill', (d: any) => {

         return '#0984e3';
        })
        .style('opacity', .7)
        // .attr('transform', 'translate(' + this.margin.left  + ',' + this.margin.top + ')')
        .attr('r', 6);

      svg.select('.focus' + i)
        .append('text')
        .attr('transform', 'translate(' + 12  + ',' + 0 + ')')
        .attr('x', 1)
        .attr('dy', '.35em');
  }

  // Create the text that travels along the curve of chart
    const focusText = svg
    .append('g')
    .append('text')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .attr('text-anchor', 'left')
      .attr('alignment-baseline', 'middle');

    svg
    .append('rect')
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .attr('width', this.width)
    .attr('height', this.height)
// tslint:disable: only-arrow-functions
      .on('mouseover', function() { focus.style('display', null); })
      .on('mousemove', mousemove)
      .on('mouseout', function() {

        // focus.style('display' , null);
        svg.selectAll('.focus').style('display', 'none');

      });

    const circleObj = {};


    svg.selectAll('.line')
      .data(inputData)
      .enter()
      .append('path')
        .attr('fill', 'none')
        .attr('class', (d: any, j: any): any => {
          return `common-line ${d.key}`;
        })
        .attr('stroke', (d: {key: any, values: any}, j: any): any => {
          const temp = {
            name: d.key,
            color: `rgb(${255 *  (t - j) / t},${ 0 * j / t},${255 * j / t})`
          };
          circleObj[temp.name] = temp.color;
          jsonData.push(temp);


          return `rgb(${255 *  (t - j) / t},${ 0 * j / t},${255 * j / t})`;
        } )
        .attr('stroke-width', 1)
        .attr('d', (d: {key: string, values: any}) => {
          return d3.line()
                  .x((dd: any): any => {
                    return x(dd.xValue);
                  })
                  .y((dd: any): any => {
                    return y(dd.yValue);
                  })
                  (d.values);
        });

    svg.append('text')
        .attr('class', 'x-label')
        .attr('text-anchor', 'end')
        .attr('x', this.width)
        .attr('y', this.height + 30)
        .style('font-size', '.65rem')
        .style('color', '#353535')
        .style('font-weight', '700')
        .style('text-transform', 'capitalize')
        .text(`${inputData[0].values[0].xColName}`);

    function mousemove() {
          // recover coordinate we need
          const x0 = x.invert(d3.mouse(this)[0]);
          const series = inputData.map( (e) => {
            const i = bisect(e.values, x0, 1);
            return e.values[i];
          });

          for (let i = 0; i < series.length; i++) {

            const selectedFocus = svg.selectAll('.focus' + i);

            selectedFocus.attr('transform', 'translate(' + x(series[i].xValue)   + ',' + y(series[i].yValue) + ')');

                     // .style('fill', `${circleObj[series[i].yColName]}` );
            selectedFocus.select('text').text(` X: ${series[i].xValue} , Y: ${series[i].yValue} ` )
            .attr('font-size', '0.7rem')
                            .attr('font-family', 'Lato');
                            // .attr('fill', `${circleObj[series[i].yColName]}`);
          }
        }
    this.legendData = [...jsonData];

  }

  createChart(inputData: any, xMax: number | string,
              yMax: number | string, xMin: number | string, yMin: number | string) {
    d3.select('#lineplot').selectAll('svg').remove();
    const data = inputData;

    const svg = d3.select('#lineplot')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right + 20)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    const x = d3.scaleLinear()
      .domain([Number(xMin), Number(xMax)])
      .range([0, this.width]);
    svg.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
      .domain([Number(yMin) - Number(yMin) / 2, Number(yMax)])
      .range([this.height, 0]);
    svg.append('g')
      .call(d3.axisLeft(y));

    const jsonData = [];
    const bisect = d3.bisector(function(d: any) {

      return d.xValue;

    }).left;

    const focus = svg
      .append('g')
      .append('circle')
      // .style('fill', 'greq')
      // .attr('stroke', 'black')
      .attr('r', 4)
      // .style('opacity', 0)
      .style('stroke', 'black')
      .style('stroke-width', 2)
      .style('fill', '#0984e3')
      .style('opacity', 0);

  // Create the text that travels along the curve of chart
    const focusText = svg
    .append('g')
    .append('text')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .attr('text-anchor', 'left')
      .attr('alignment-baseline', 'middle');

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', (d: any): any => {
        const temp = {
          name: d[0].yColName,
          color: 'steelblue'
        };
        jsonData.push(temp);
        return 'steelblue';
      } )
      .attr('stroke-width', 1.5)
      .attr('d', d3.line()
        .x((d: any) => x(d.xValue))
        .y((d: any) => y(d.yValue)));
    // this.readLegend.emit(jsonData);
    this.legendData = [...jsonData];



    svg.append('text')
    .attr('class', 'x-label')
    .attr('text-anchor', 'end')
    .attr('x', this.width)
    .attr('y', this.height + 30)
    .style('font-size', '.65rem')
    .style('color', '#353535')
    .style('font-weight', '700')
    .style('text-transform', 'capitalize')
    .text(`${inputData[0].xColName}`);


    svg
    .append('rect')
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .attr('width', this.width)
    .attr('height', this.height)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);




    function mouseover() {
      focus.style('opacity', 0.7);
      focusText.style('opacity', 1)
                .style('font-family', 'Lato')
                .style('font-size', '0.7rem')
                .style('background-color', 'red');
    }

    function mousemove() {
      // recover coordinate we need
      const x0 = x.invert(d3.mouse(this)[0]);
      const i = bisect(data, x0, 1);
      const selectedData = data[i];

      focus
        .attr('cx', x(selectedData.xValue))
        .attr('cy', y(selectedData.yValue));
      focusText
        .html(`X: ${selectedData.xValue}, Y: ${selectedData.yValue}`)
        .attr('x', x(selectedData.xValue) + 15)
        .attr('y', y(selectedData.yValue));
      }
    function mouseout() {
      focus.style('opacity', 0);
      focusText.style('opacity', 0);
    }
  }
}
